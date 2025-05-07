import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';
import { updateUserProfile } from '../../store/slices/authSlice';
import { validateImageFile, getImagePreviewUrl } from '../../utils/fileUtils';

const UserIcon = getIcon('User');
const CameraIcon = getIcon('Camera');
const UploadIcon = getIcon('Upload');

const ProfilePhotoUpload = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      
      // Get preview URL
      const photoUrl = await getImagePreviewUrl(file);
      
      // In a real app, you would upload the file to a server here
      // and get back a permanent URL
      
      // Update user profile with new photo
      dispatch(updateUserProfile({ photo: photoUrl }));
      toast.success('Profile photo updated successfully');
      
    } catch (error) {
      toast.error(error.message || 'Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-24 h-24 rounded-full relative overflow-hidden border-4 border-white dark:border-surface-800 shadow-lg bg-surface-200 dark:bg-surface-700">
        {user?.photo ? (
          <img 
            src={user.photo} 
            alt={`${user.firstName} ${user.lastName}`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-surface-400">
            <UserIcon size={40} />
          </div>
        )}
        
        {/* Upload overlay */}
        <motion.button
          whileHover={{ opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity"
          onClick={handleFileClick}
          disabled={isUploading}
        >
          {isUploading ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <UploadIcon size={24} className="text-white" />
            </motion.div>
          ) : (
            <CameraIcon size={24} className="text-white" />
          )}
        </motion.button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </motion.div>
  );
};

export default ProfilePhotoUpload;