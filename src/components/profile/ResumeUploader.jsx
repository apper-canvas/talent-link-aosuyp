import { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../../utils/iconUtils';
import { uploadResume, deleteResume, setDefaultResume } from '../../store/slices/profileSlice';
import { validateResumeFile } from '../../utils/fileUtils';

const UploadIcon = getIcon('Upload');
const FileIcon = getIcon('File');
const FileTextIcon = getIcon('FileText');
const FilePdfIcon = getIcon('FilePdf');
const TrashIcon = getIcon('Trash');
const CheckCircleIcon = getIcon('CheckCircle');
const FileWordIcon = getIcon('FileText'); // We'll use FileText for Word docs too
const StarIcon = getIcon('Star');
const ExternalLinkIcon = getIcon('ExternalLink');
const AlertCircleIcon = getIcon('AlertCircle');

const ResumeUploader = () => {
  const dispatch = useDispatch();
  const { resumes, loading } = useSelector(state => state.profile);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [resumeTitle, setResumeTitle] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  
  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }
    
    setUploadedFile(file);
    // Auto-generate title from filename (remove extension)
    const title = file.name.replace(/\.[^/.]+$/, "");
    setResumeTitle(title);
    
    // If this is the first resume, set as default
    if (resumes.length === 0) {
      setIsDefault(true);
    }
  };
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      const validation = validateResumeFile(file);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      
      setUploadedFile(file);
      const title = file.name.replace(/\.[^/.]+$/, "");
      setResumeTitle(title);
      
      if (resumes.length === 0) {
        setIsDefault(true);
      }
    }
  };
  
  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle form submission (upload resume)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!uploadedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!resumeTitle.trim()) {
      toast.error('Please provide a title for your resume');
      return;
    }
    
    dispatch(uploadResume({
      title: resumeTitle,
      file: uploadedFile,
      isDefault
    }))
      .unwrap()
      .then(() => {
        toast.success('Resume uploaded successfully');
        setUploadedFile(null);
        setResumeTitle('');
        setIsDefault(false);
      })
      .catch((error) => {
        toast.error(error || 'Failed to upload resume');
      });
  };
  
  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') {
      return FilePdfIcon;
    } else if (fileType.includes('word')) {
      return FileWordIcon;
    } else {
      return FileTextIcon;
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Handle delete resume
  const handleDeleteClick = (resumeId) => {
    setShowDeleteConfirm(resumeId);
  };
  
  const confirmDelete = (resumeId) => {
    dispatch(deleteResume(resumeId))
      .unwrap()
      .then(() => {
        toast.success('Resume deleted successfully');
        setShowDeleteConfirm(null);
      })
      .catch((error) => {
        toast.error(error || 'Failed to delete resume');
      });
  };
  
  // Handle setting a resume as default
  const handleSetDefault = (resumeId) => {
    dispatch(setDefaultResume(resumeId))
      .unwrap()
      .then(() => {
        toast.success('Default resume updated');
      })
      .catch((error) => {
        toast.error(error || 'Failed to update default resume');
      });
  };
  
  // View resume (in real app would open the stored file URL)
  const handleViewResume = (resume) => {
    toast.info(`Opening ${resume.title}... In a real app, this would open the actual file.`);
  };
  
  return (
    <div>
      {/* Upload Area */}
      <div 
        className={`border-2 border-dashed rounded-lg p-6 mb-6 transition-colors ${
          dragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-surface-300 dark:border-surface-600'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center py-4">
          <UploadIcon size={40} className="mx-auto mb-4 text-surface-400" />
          <h3 className="text-lg font-medium mb-2">Upload Your Resume</h3>
          <p className="text-surface-600 dark:text-surface-400 mb-4">Drag and drop your file here, or click to browse</p>
          <button
            type="button"
            onClick={handleUploadClick}
            className="btn-primary"
          >
            Browse Files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <p className="text-sm text-surface-500 mt-3">
            Accepted file types: PDF, DOC, DOCX (Max 10MB)
          </p>
        </div>
      </div>
      
      {/* File Details (if a file is selected) */}
      {uploadedFile && (
        <div className="bg-surface-100 dark:bg-surface-800 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="bg-white dark:bg-surface-700 p-2 rounded-lg shadow-sm mr-4">
              <FileIcon size={24} className="text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{uploadedFile.name}</h4>
              <p className="text-sm text-surface-500">
                {formatFileSize(uploadedFile.size)} • {uploadedFile.type.split('/')[1].toUpperCase()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUploadedFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon size={18} />
            </button>
          </div>
          
          <div className="mt-4">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Resume Title</label>
                <input
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  className="form-input"
                  placeholder="e.g., Software Engineer Resume 2023"
                  required
                />
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="default-resume"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="default-resume">Set as default resume</label>
              </div>
              
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Existing Resumes */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Your Resumes</h3>
        
        {resumes.length === 0 ? (
          <div className="text-center py-6 bg-surface-100 dark:bg-surface-800 rounded-lg">
            <FileTextIcon size={32} className="mx-auto mb-3 text-surface-400" />
            <p className="text-surface-600 dark:text-surface-400">
              You haven't uploaded any resumes yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {resumes.map((resume) => {
                const FileTypeIcon = getFileIcon(resume.fileType);
                
                return (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center p-4 rounded-lg border ${
                      resume.isDefault
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-surface-200 dark:border-surface-700'
                    }`}
                  >
                    <div className="bg-white dark:bg-surface-700 p-2 rounded-lg shadow-sm mr-4">
                      <FileTypeIcon size={24} className="text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">{resume.title}</h4>
                        {resume.isDefault && (
                          <span className="ml-2 inline-flex items-center text-xs text-primary">
                            <CheckCircleIcon size={12} className="mr-1" /> Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-surface-500 flex items-center mt-1">
                        <span className="mr-3">{formatFileSize(resume.fileSize)}</span>
                        <span>Uploaded on {formatDate(resume.date)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleViewResume(resume)}
                        className="text-primary hover:text-primary-dark p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
                        title="View Resume"
                      >
                        <ExternalLinkIcon size={18} />
                      </button>
                      
                      {!resume.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(resume.id)}
                          className="text-secondary hover:text-secondary-dark p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
                          title="Set as Default"
                        >
                          <StarIcon size={18} />
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={() => handleDeleteClick(resume.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700"
                        title="Delete Resume"
                      >
                        <TrashIcon size={18} />
                      </button>
                      
                      {/* Delete Confirmation */}
                      {showDeleteConfirm === resume.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
                        >
                          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md w-full p-6">
                            <div className="flex items-center text-red-500 mb-4">
                              <AlertCircleIcon size={24} className="mr-2" />
                              <h4 className="text-lg font-semibold">Delete Resume</h4>
                            </div>
                            
                            <p className="mb-6">
                              Are you sure you want to delete <span className="font-medium">{resume.title}</span>? 
                              This action cannot be undone.
                            </p>
                            
                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(null)}
                                className="px-4 py-2 rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => confirmDelete(resume.id)}
                                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;