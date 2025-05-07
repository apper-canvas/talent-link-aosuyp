import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';
import useAuth from '../../hooks/useAuth';

// Components
import ProfileHeader from '../../components/profile/ProfileHeader';
import PersonalInfoForm from '../../components/profile/PersonalInfoForm';
import ExperienceForm from '../../components/profile/ExperienceForm';
import EducationForm from '../../components/profile/EducationForm';
import SkillsManager from '../../components/profile/SkillsManager';
import ResumeUploader from '../../components/profile/ResumeUploader';

// Icons
const UserIcon = getIcon('User');
const BriefcaseIcon = getIcon('Briefcase');
const GraduationCapIcon = getIcon('GraduationCap');
const CodeIcon = getIcon('Code');
const FileTextIcon = getIcon('FileText');
const SaveIcon = getIcon('Save');
const ArrowLeftIcon = getIcon('ArrowLeft');

const CandidateProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { profile, loading } = useSelector(state => state.profile);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('personal');
  
  // Ensure user is a job seeker
  useEffect(() => {
    if (user && user.userType !== 'jobSeeker') {
      toast.error('Only job seekers can access the candidate profile');
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Tabs configuration
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'experience', label: 'Experience', icon: BriefcaseIcon },
    { id: 'education', label: 'Education', icon: GraduationCapIcon },
    { id: 'skills', label: 'Skills', icon: CodeIcon },
    { id: 'resumes', label: 'Resumes', icon: FileTextIcon },
  ];
  
  // Tab content mapping
  const tabContent = {
    personal: <PersonalInfoForm />,
    experience: <ExperienceForm />,
    education: <EducationForm />,
    skills: <SkillsManager />,
    resumes: <ResumeUploader />,
  };
  
  return (
    <div className="bg-surface-50 dark:bg-surface-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Header */}
          <div className="lg:col-span-12">
            <ProfileHeader />
          </div>
          
          {/* Tabs and Content */}
          <div className="lg:col-span-3">
            <div className="sticky top-8">
              <div className="card p-4">
                <h3 className="text-lg font-medium mb-4">Profile Sections</h3>
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-surface-100 dark:hover:bg-surface-800'
                      }`}
                    >
                      <tab.icon size={18} className={`mr-2 ${activeTab === tab.id ? 'text-white' : 'text-primary'}`} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
                
                {/* Profile Completion Status */}
                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-2">Profile Completion</h4>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${calculateProfileCompletion(profile)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-surface-500">
                    {calculateProfileCompletion(profile)}% complete
                  </p>
                </div>
                
                {/* Save Button (Mobile) */}
                <div className="mt-6 lg:hidden">
                  <SaveButton loading={loading} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="card">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">{tabs.find(tab => tab.id === activeTab)?.label}</h2>
                  
                  {/* Save Button (Desktop) */}
                  <div className="hidden lg:block">
                    <SaveButton loading={loading} />
                  </div>
                </div>
                
                {/* Active Tab Content */}
                <div>
                  {tabContent[activeTab]}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Save Button Component
const SaveButton = ({ loading }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className="btn-primary"
    disabled={loading}
  >
    {loading ? (
      <span className="inline-flex items-center">
        <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="mr-2">
          <SaveIcon size={16} />
        </motion.span>
        Saving...
      </span>
    ) : (
      <span className="inline-flex items-center">
        <SaveIcon size={16} className="mr-2" /> Save Changes
      </span>
    )}
  </motion.button>
);

// Calculate profile completion percentage
const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  
  const requiredFields = [
    'bio', 'phone', 'location', 'headline', 
    'yearsOfExperience', 'socialLinks', 'experience', 
    'education', 'skills'
  ];
  
  let filledFields = 0;
  
  requiredFields.forEach(field => {
    if (field === 'socialLinks') {
      if (profile.socialLinks && Object.values(profile.socialLinks).some(link => link && link.trim() !== '')) {
        filledFields++;
      }
    } else if (field === 'experience' || field === 'education' || field === 'skills') {
      if (profile[field] && profile[field].length > 0) {
        filledFields++;
      }
    } else if (profile[field] && profile[field].toString().trim() !== '') {
      filledFields++;
    }
  });
  
  return Math.round((filledFields / requiredFields.length) * 100);
};

export default CandidateProfile;