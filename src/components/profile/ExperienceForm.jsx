import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../../utils/iconUtils';
import FormInput from '../FormInput';
import { saveProfile } from '../../store/slices/profileSlice';

const PlusIcon = getIcon('Plus');
const TrashIcon = getIcon('Trash');
const EditIcon = getIcon('Edit');
const BriefcaseIcon = getIcon('Briefcase');
const CalendarIcon = getIcon('Calendar');
const BuildingIcon = getIcon('Building');
const MapPinIcon = getIcon('MapPin');

const ExperienceForm = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector(state => state.profile);
  
  // State for experience entries
  const [experiences, setExperiences] = useState([]);
  
  // State for form
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  
  // Load existing experience data
  useEffect(() => {
    if (profile && profile.experience) {
      setExperiences(profile.experience);
    }
  }, [profile]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // If "current" is checked, clear end date
    if (name === 'current' && checked) {
      setFormData(prev => ({
        ...prev,
        endDate: ''
      }));
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditIndex(null);
    setShowForm(false);
  };
  
  // Add new experience
  const addExperience = () => {
    setShowForm(true);
    resetForm();
  };
  
  // Edit existing experience
  const editExperience = (index) => {
    setFormData(experiences[index]);
    setEditIndex(index);
    setShowForm(true);
  };
  
  // Delete experience
  const deleteExperience = (index) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
    
    // Save updated experiences
    dispatch(saveProfile({
      ...profile,
      experience: newExperiences
    }))
      .unwrap()
      .then(() => {
        toast.success('Experience deleted successfully');
      })
      .catch((error) => {
        toast.error(error || 'Failed to delete experience');
      });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.company || !formData.startDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    let newExperiences = [...experiences];
    
    if (editIndex !== null) {
      // Update existing experience
      newExperiences[editIndex] = formData;
    } else {
      // Add new experience
      newExperiences.push({
        ...formData,
        id: Math.random().toString(36).substring(2, 9)
      });
    }
    
    // Sort by date (most recent first)
    newExperiences.sort((a, b) => {
      const dateA = a.current ? new Date() : new Date(a.endDate);
      const dateB = b.current ? new Date() : new Date(b.endDate);
      return dateB - dateA;
    });
    
    setExperiences(newExperiences);
    
    // Save to profile
    dispatch(saveProfile({
      ...profile,
      experience: newExperiences
    }))
      .unwrap()
      .then(() => {
        toast.success(editIndex !== null ? 'Experience updated successfully' : 'Experience added successfully');
        resetForm();
      })
      .catch((error) => {
        toast.error(error || 'Failed to save experience');
      });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  return (
    <div>
      {/* Experience List */}
      {experiences.length === 0 && !showForm ? (
        <div className="text-center py-8">
          <BriefcaseIcon size={48} className="mx-auto text-surface-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Experience Added</h3>
          <p className="text-surface-500 mb-6">Add your work experience to showcase your professional journey</p>
          <button
            onClick={addExperience}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon size={16} className="mr-2" /> Add Experience
          </button>
        </div>
      ) : (
        <>
          {/* List of Experiences */}
          {!showForm && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <button
                  onClick={addExperience}
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon size={16} className="mr-2" /> Add New
                </button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {experiences.map((exp, index) => (
                    <motion.div
                      key={exp.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="card p-4 border border-surface-200 dark:border-surface-700"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{exp.title}</h4>
                          <div className="flex items-center text-surface-600 dark:text-surface-400 mt-1">
                            <BuildingIcon size={14} className="mr-1" />
                            <span>{exp.company}</span>
                          </div>
                          {exp.location && (
                            <div className="flex items-center text-surface-500 text-sm mt-1">
                              <MapPinIcon size={14} className="mr-1" />
                              <span>{exp.location}</span>
                            </div>
                          )}
                          <div className="flex items-center text-surface-500 text-sm mt-1">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>
                              {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                            </span>
                          </div>
                          {exp.description && (
                            <p className="mt-3 text-surface-700 dark:text-surface-300 text-sm">{exp.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => editExperience(index)}
                            className="p-2 text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => deleteExperience(index)}
                            className="p-2 text-red-500 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          {/* Experience Form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="border border-surface-200 dark:border-surface-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-medium mb-4">{editIndex !== null ? 'Edit Experience' : 'Add Experience'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormInput
                    label="Job Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Software Engineer"
                    required
                    icon="Briefcase"
                  />
                  
                  <FormInput
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Acme Corporation"
                    required
                    icon="Building"
                  />
                </div>
                
                <FormInput
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., New York, NY"
                  icon="MapPin"
                  className="mb-4"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormInput
                    label="Start Date"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                  
                  <div>
                    <FormInput
                      label="End Date"
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      disabled={formData.current}
                    />
                    
                    <div className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        id="current"
                        name="current"
                        checked={formData.current}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="current" className="text-sm">I currently work here</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your responsibilities and achievements"
                    rows={4}
                    className="form-input"
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-800 dark:text-surface-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : (editIndex !== null ? 'Update' : 'Save')}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default ExperienceForm;