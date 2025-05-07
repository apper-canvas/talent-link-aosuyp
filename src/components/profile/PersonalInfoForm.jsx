import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import getIcon from '../../utils/iconUtils';
import FormInput from '../FormInput';
import { saveProfile } from '../../store/slices/profileSlice';

const PhoneIcon = getIcon('Phone');
const MapPinIcon = getIcon('MapPin');
const GlobeIcon = getIcon('Globe');
const LinkedinIcon = getIcon('Linkedin');
const GithubIcon = getIcon('Github');
const TwitterIcon = getIcon('Twitter');
const BriefcaseIcon = getIcon('Briefcase');

const PersonalInfoForm = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector(state => state.profile);
  
  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    phone: '',
    location: '',
    website: '',
    headline: '',
    yearsOfExperience: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: ''
    }
  });
  
  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        phone: profile.phone || '',
        location: profile.location || '',
        website: profile.website || '',
        headline: profile.headline || '',
        yearsOfExperience: profile.yearsOfExperience || '',
        socialLinks: {
          linkedin: profile.socialLinks?.linkedin || '',
          github: profile.socialLinks?.github || '',
          twitter: profile.socialLinks?.twitter || ''
        }
      });
    }
  }, [profile]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (social links)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save profile data
    dispatch(saveProfile({
      ...profile,
      ...formData
    }))
      .unwrap()
      .then(() => {
        toast.success('Personal information saved successfully');
      })
      .catch((error) => {
        toast.error(error || 'Failed to save personal information');
      });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Professional Headline */}
      <div className="mb-6">
        <label htmlFor="headline" className="form-label">Professional Headline</label>
        <FormInput
          type="text"
          name="headline"
          value={formData.headline}
          onChange={handleChange}
          placeholder="e.g., Senior Software Engineer with 5+ years of experience"
          icon="Award"
        />
      </div>
      
      {/* Bio */}
      <div className="mb-6">
        <label htmlFor="bio" className="form-label">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows={4}
          className="form-input"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Phone */}
        <FormInput
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Your phone number"
          icon="Phone"
        />
        
        {/* Location */}
        <FormInput
          label="Location"
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, State, Country"
          icon="MapPin"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Website */}
        <FormInput
          label="Personal Website"
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://yourwebsite.com"
          icon="Globe"
        />
        
        {/* Years of Experience */}
        <FormInput
          label="Years of Experience"
          type="number"
          name="yearsOfExperience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          placeholder="e.g., 5"
          icon="Briefcase"
        />
      </div>
      
      {/* Social Links */}
      <h3 className="text-lg font-medium mb-4">Social Links</h3>
      <div className="space-y-4 mb-6">
        <FormInput
          label="LinkedIn"
          type="url"
          name="socialLinks.linkedin"
          value={formData.socialLinks.linkedin}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/yourprofile"
          icon="Linkedin"
        />
        
        <FormInput
          label="GitHub"
          type="url"
          name="socialLinks.github"
          value={formData.socialLinks.github}
          onChange={handleChange}
          placeholder="https://github.com/yourusername"
          icon="Github"
        />
        
        <FormInput
          label="Twitter"
          type="url"
          name="socialLinks.twitter"
          value={formData.socialLinks.twitter}
          onChange={handleChange}
          placeholder="https://twitter.com/yourusername"
          icon="Twitter"
        />
      </div>
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;