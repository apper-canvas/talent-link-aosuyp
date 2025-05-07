import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';
import ProfilePhotoUpload from './ProfilePhotoUpload';

const MapPinIcon = getIcon('MapPin');
const BriefcaseIcon = getIcon('Briefcase');

const ProfileHeader = () => {
  const { user } = useSelector(state => state.auth);
  const { profile } = useSelector(state => state.profile);
  
  return (
    <div className="card overflow-hidden">
      {/* Cover Background */}
      <div className="h-32 bg-gradient-to-r from-primary to-purple-500"></div>
      
      {/* Profile Info */}
      <div className="px-6 pt-0 pb-6 relative">
        <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4">
          {/* Profile Photo */}
          <div className="md:mr-6 mb-4 md:mb-0">
            <ProfilePhotoUpload />
          </div>
          
          {/* Basic Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mt-4">{user?.firstName} {user?.lastName}</h1>
            <p className="text-surface-600 dark:text-surface-400 mt-1">{profile?.headline || 'Add your professional headline'}</p>
            <div className="flex flex-wrap gap-4 mt-3">
              {profile?.location && <span className="flex items-center text-sm text-surface-500"><MapPinIcon size={16} className="mr-1" /> {profile.location}</span>}
              {profile?.yearsOfExperience && <span className="flex items-center text-sm text-surface-500"><BriefcaseIcon size={16} className="mr-1" /> {profile.yearsOfExperience} years experience</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;