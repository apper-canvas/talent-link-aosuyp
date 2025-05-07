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
const GraduationCapIcon = getIcon('GraduationCap');
const CalendarIcon = getIcon('Calendar');
const AwardIcon = getIcon('Award');
const MapPinIcon = getIcon('MapPin');

const EducationForm = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector(state => state.profile);
  
  // State for education entries
  const [educations, setEducations] = useState([]);
  
  // State for form
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  
  // Load existing education data
  useEffect(() => {
    if (profile && profile.education) {
      setEducations(profile.education);
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
      school: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
    setEditIndex(null);
    setShowForm(false);
  };
  
  // Add new education
  const addEducation = () => {
    setShowForm(true);
    resetForm();
  };
  
  // Edit existing education
  const editEducation = (index) => {
    setFormData(educations[index]);
    setEditIndex(index);
    setShowForm(true);
  };
  
  // Delete education
  const deleteEducation = (index) => {
    const newEducations = [...educations];
    newEducations.splice(index, 1);
    setEducations(newEducations);
    
    // Save updated educations
    dispatch(saveProfile({
      ...profile,
      education: newEducations
    }))
      .unwrap()
      .then(() => {
        toast.success('Education deleted successfully');
      })
      .catch((error) => {
        toast.error(error || 'Failed to delete education');
      });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.school || !formData.degree || !formData.startDate) {
      toast.error('Please fill all required fields');
      return;
    }
    
    let newEducations = [...educations];
    
    if (editIndex !== null) {
      // Update existing education
      newEducations[editIndex] = formData;
    } else {
      // Add new education
      newEducations.push({
        ...formData,
        id: Math.random().toString(36).substring(2, 9)
      });
    }
    
    // Sort by date (most recent first)
    newEducations.sort((a, b) => {
      const dateA = a.current ? new Date() : new Date(a.endDate);
      const dateB = b.current ? new Date() : new Date(b.endDate);
      return dateB - dateA;
    });
    
    setEducations(newEducations);
    
    // Save to profile
    dispatch(saveProfile({
      ...profile,
      education: newEducations
    }))
      .unwrap()
      .then(() => {
        toast.success(editIndex !== null ? 'Education updated successfully' : 'Education added successfully');
        resetForm();
      })
      .catch((error) => {
        toast.error(error || 'Failed to save education');
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
      {/* Education List */}
      {educations.length === 0 && !showForm ? (
        <div className="text-center py-8">
          <GraduationCapIcon size={48} className="mx-auto text-surface-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Education Added</h3>
          <p className="text-surface-500 mb-6">Add your educational background to showcase your qualifications</p>
          <button
            onClick={addEducation}
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon size={16} className="mr-2" /> Add Education
          </button>
        </div>
      ) : (
        <>
          {/* List of Educations */}
          {!showForm && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Education</h3>
                <button
                  onClick={addEducation}
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon size={16} className="mr-2" /> Add New
                </button>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {educations.map((edu, index) => (
                    <motion.div
                      key={edu.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="card p-4 border border-surface-200 dark:border-surface-700"
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{edu.school}</h4>
                          <div className="flex items-center text-surface-600 dark:text-surface-400 mt-1">
                            <AwardIcon size={14} className="mr-1" />
                            <span>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</span>
                          </div>
                          {edu.location && (
                            <div className="flex items-center text-surface-500 text-sm mt-1">
                              <MapPinIcon size={14} className="mr-1" />
                              <span>{edu.location}</span>
                            </div>
                          )}
                          <div className="flex items-center text-surface-500 text-sm mt-1">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>
                              {formatDate(edu.startDate)} - {edu.current ? 'Present' : formatDate(edu.endDate)}
                            </span>
                          </div>
                          {edu.description && (
                            <p className="mt-3 text-surface-700 dark:text-surface-300 text-sm">{edu.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => editEducation(index)}
                            className="p-2 text-primary hover:bg-surface-100 dark:hover:bg-surface-700 rounded-full"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={() => deleteEducation(index)}
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
          
          {/* Education Form */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="border border-surface-200 dark:border-surface-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-medium mb-4">{editIndex !== null ? 'Edit Education' : 'Add Education'}</h3>
                
                <FormInput
                  label="School/University"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="e.g., Stanford University"
                  required
                  icon="GraduationCap"
                  className="mb-4"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormInput
                    label="Degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    placeholder="e.g., Bachelor of Science"
                    required
                    icon="Award"
                  />
                  
                  <FormInput
                    label="Field of Study"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    icon="Book"
                  />
                </div>
                
                <FormInput
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Stanford, CA"
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
                        id="current-edu"
                        name="current"
                        checked={formData.current}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor="current-edu" className="text-sm">I'm currently studying here</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add any additional information about your education"
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

export default EducationForm;