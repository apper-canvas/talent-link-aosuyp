import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for registering a user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // In a real application, this would be an API call
      // For now, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return the user data (would come from backend in real app)
      return {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        token: 'dummy-jwt-token-' + Math.random().toString(36).substr(2, 9),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  userType: null, // 'jobSeeker' or 'employer'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    logout: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setUserType, logout } = authSlice.actions;
export default authSlice.reducer;