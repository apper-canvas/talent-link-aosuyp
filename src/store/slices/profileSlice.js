import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Helpers to get initial state from localStorage
const loadProfileState = () => {
  try {
    const profileData = localStorage.getItem('candidateProfile');
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Failed to load profile state:', error);
    return null;
  }
};

// Save profile data to localStorage
const saveProfileState = (profile) => {
  try {
    localStorage.setItem('candidateProfile', JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile state:', error);
  }
};

// Load initial resumes from localStorage
const loadResumesState = () => {
  try {
    const resumesData = localStorage.getItem('candidateResumes');
    return resumesData ? JSON.parse(resumesData) : [];
  } catch (error) {
    console.error('Failed to load resumes state:', error);
    return [];
  }
};

// Save resumes to localStorage
const saveResumesState = (resumes) => {
  try {
    localStorage.setItem('candidateResumes', JSON.stringify(resumes));
  } catch (error) {
    console.error('Failed to save resumes state:', error);
  }
};

// Async thunk for saving profile changes
export const saveProfile = createAsyncThunk(
  'profile/saveProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API request to save profile data
      saveProfileState(profileData);
      
      return profileData;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to save profile');
    }
  }
);

// Async thunk for uploading resume
export const uploadResume = createAsyncThunk(
  'profile/uploadResume',
  async (resumeData, { rejectWithValue, getState }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API request to upload file
      const currentResumes = getState().profile.resumes || [];
      const newResume = {
        id: Math.random().toString(36).substring(2, 11),
        title: resumeData.title,
        file: resumeData.file.name,
        date: new Date().toISOString(),
        isDefault: resumeData.isDefault || currentResumes.length === 0,
        fileType: resumeData.file.type,
        fileSize: resumeData.file.size,
      };
      
      let updatedResumes = [...currentResumes];
      
      // If this is set as default, update other resumes
      if (newResume.isDefault) {
        updatedResumes = updatedResumes.map(resume => ({
          ...resume,
          isDefault: false
        }));
      }
      
      updatedResumes.push(newResume);
      saveResumesState(updatedResumes);
      
      return updatedResumes;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to upload resume');
    }
  }
);

// Get loaded profile or create an empty one
const loadedProfile = loadProfileState() || {
  // Basic info
  bio: '',
  phone: '',
  location: '',
  website: '',
  
  // Professional info
  headline: '',
  yearsOfExperience: '',
  
  // Social links
  socialLinks: {
    linkedin: '',
    github: '',
    twitter: ''
  },
  
  // Experience entries
  experience: [],
  
  // Education entries
  education: [],
  
  // Skills list
  skills: []
};

const initialState = {
  profile: loadedProfile,
  resumes: loadResumesState(),
  loading: false,
  error: null,
  success: false
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Save profile
      .addCase(saveProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      
      // Upload resume
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.resumes = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default profileSlice.reducer;