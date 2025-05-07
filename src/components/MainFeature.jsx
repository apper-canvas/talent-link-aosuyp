import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const MainFeature = ({ userType = 'jobSeeker' }) => {
  // Icon declarations
  const SearchIcon = getIcon('Search');
  const BriefcaseIcon = getIcon('Briefcase');
  const MapPinIcon = getIcon('MapPin');
  const BuildingIcon = getIcon('Building');
  const UploadIcon = getIcon('Upload');
  const CheckCircleIcon = getIcon('CheckCircle');
  const XCircleIcon = getIcon('XCircle');
  const ChevronDownIcon = getIcon('ChevronDown');
  
  // Job seeker state
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);
  
  // Employer state
  const [jobTitle, setJobTitle] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Reset form when user type changes
  useEffect(() => {
    setSearchTerm('');
    setLocation('');
    setJobType('');
    setJobTitle('');
    setJobLocation('');
    setJobDescription('');
    setErrors({});
    setShowSuccessMessage(false);
  }, [userType]);
  
  // Job types for dropdown
  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote'
  ];
  
  // Form validation for job seeker
  const validateJobSeekerForm = () => {
    const newErrors = {};
    if (!searchTerm.trim()) {
      newErrors.searchTerm = 'Please enter a job title or keyword';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form validation for employer
  const validateEmployerForm = () => {
    const newErrors = {};
    if (!jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!jobLocation.trim()) {
      newErrors.jobLocation = 'Job location is required';
    }
    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    } else if (jobDescription.trim().length < 20) {
      newErrors.jobDescription = 'Description must be at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle job search
  const handleJobSearch = (e) => {
    e.preventDefault();
    
    if (validateJobSeekerForm()) {
      toast.success(`Searching for ${searchTerm} jobs${location ? ` in ${location}` : ''}${jobType ? ` (${jobType})` : ''}`);
      
      // In a full implementation, this would call an API to search for jobs
      // For now, we'll just show a toast message
    }
  };
  
  // Handle job posting
  const handleJobPost = (e) => {
    e.preventDefault();
    
    if (validateEmployerForm()) {
      // Show success message and clear form
      setShowSuccessMessage(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        setJobTitle('');
        setJobLocation('');
        setJobDescription('');
      }, 3000);
      
      toast.success("Job posting created successfully!");
    } else {
      toast.error("Please fix the errors in the form");
    }
  };
  
  // Handle file upload
  const handleResumeUpload = () => {
    toast.info("Resume upload functionality would be available in the full version.");
  };
  
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {userType === 'jobSeeker' ? (
          <motion.div
            key="jobSeeker"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleJobSearch} className="space-y-4">
              {/* Job Search Input */}
              <div>
                <label htmlFor="searchTerm" className="form-label">Job Title or Keywords</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                    <SearchIcon size={18} />
                  </div>
                  <input
                    type="text"
                    id="searchTerm"
                    className={`form-input pl-10 ${errors.searchTerm ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Software Engineer, Marketing, Sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {errors.searchTerm && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <XCircleIcon size={14} className="mr-1" />
                    {errors.searchTerm}
                  </p>
                )}
              </div>
              
              {/* Location Input */}
              <div>
                <label htmlFor="location" className="form-label">Location (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                    <MapPinIcon size={18} />
                  </div>
                  <input
                    type="text"
                    id="location"
                    className="form-input pl-10"
                    placeholder="City, State, or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Job Type Dropdown */}
              <div>
                <label htmlFor="jobType" className="form-label">Job Type (Optional)</label>
                <div className="relative">
                  <button
                    type="button"
                    className="form-input w-full text-left flex items-center justify-between"
                    onClick={() => setShowJobTypeDropdown(!showJobTypeDropdown)}
                  >
                    <span className="flex items-center">
                      <BriefcaseIcon size={18} className="mr-2 text-surface-500" />
                      {jobType || 'Select Job Type'}
                    </span>
                    <ChevronDownIcon size={18} className={`transition-transform duration-200 ${showJobTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showJobTypeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg shadow-lg py-1 max-h-60 overflow-auto">
                      {jobTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                          onClick={() => {
                            setJobType(type);
                            setShowJobTypeDropdown(false);
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="btn-primary py-2.5 flex-1"
                >
                  Search Jobs
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="btn-outline py-2.5 flex items-center justify-center gap-2"
                  onClick={handleResumeUpload}
                >
                  <UploadIcon size={18} />
                  <span>Upload Resume</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="employer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {showSuccessMessage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 text-center"
              >
                <CheckCircleIcon size={48} className="mx-auto mb-3 text-green-500" />
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">Job Posted Successfully!</h3>
                <p className="text-green-700 dark:text-green-300">
                  Your job posting has been created and is now visible to potential candidates.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleJobPost} className="space-y-4">
                {/* Job Title Input */}
                <div>
                  <label htmlFor="jobTitle" className="form-label">Job Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                      <BriefcaseIcon size={18} />
                    </div>
                    <input
                      type="text"
                      id="jobTitle"
                      className={`form-input pl-10 ${errors.jobTitle ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Software Engineer, Marketing Manager..."
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                  {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <XCircleIcon size={14} className="mr-1" />
                      {errors.jobTitle}
                    </p>
                  )}
                </div>
                
                {/* Job Location Input */}
                <div>
                  <label htmlFor="jobLocation" className="form-label">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-500">
                      <MapPinIcon size={18} />
                    </div>
                    <input
                      type="text"
                      id="jobLocation"
                      className={`form-input pl-10 ${errors.jobLocation ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="City, State, or Remote"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                    />
                  </div>
                  {errors.jobLocation && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <XCircleIcon size={14} className="mr-1" />
                      {errors.jobLocation}
                    </p>
                  )}
                </div>
                
                {/* Job Description Textarea */}
                <div>
                  <label htmlFor="jobDescription" className="form-label">Job Description</label>
                  <textarea
                    id="jobDescription"
                    rows="4"
                    className={`form-input resize-none ${errors.jobDescription ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Describe the role, responsibilities, requirements..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  ></textarea>
                  <div className="flex justify-between mt-1">
                    {errors.jobDescription ? (
                      <p className="text-sm text-red-500 flex items-center">
                        <XCircleIcon size={14} className="mr-1" />
                        {errors.jobDescription}
                      </p>
                    ) : (
                      <p className="text-xs text-surface-500">
                        Min 20 characters
                      </p>
                    )}
                    <p className="text-xs text-surface-500">
                      {jobDescription.length} characters
                    </p>
                  </div>
                </div>
                
                {/* Post Job Button */}
                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2"
                  >
                    <BuildingIcon size={18} />
                    <span>Post Job</span>
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;