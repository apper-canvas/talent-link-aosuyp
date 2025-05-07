import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hashPassword, validatePassword, comparePasswords } from '../../utils/passwordUtils';

// Load user data from localStorage if available
const loadUserState = () => {
  try {
    const userToken = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (userToken && userData) {
      return {
        user: JSON.parse(userData),
        token: userToken,
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error('Failed to load user state:', error);
  }
  return { user: null, token: null, isAuthenticated: false };
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // In a real application, this would be an API call
      // Validate password strength
      const validationResult = validatePassword(userData.password);
      if (!validationResult.isValid) {
        return rejectWithValue(validationResult.message);
      }
      
      // Hash the password (in real app, this would be done server-side)
      const hashedPassword = await hashPassword(userData.password);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        password: hashedPassword, // In a real app, never return password to client
      };

      // Generate a JWT-like token
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
        Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64') + 
        '.dummy_signature';

      // Save in localStorage (in real app, only store token, not user data for security)
      localStorage.setItem('userToken', token);
      localStorage.setItem('userData', JSON.stringify({
        id: user.id, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photo || null,
        userType: user.userType
      }));

      // Return the user data (would come from backend in real app)
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would validate against a backend
      // Here we're just simulating with local storage for demo
      
      // For demo purposes - in real app this would be server-side
      const demoUsers = [
        {
          id: '123456789',
          email: 'jobseeker@example.com',
          password: await hashPassword('Password123!'),
          firstName: 'John',
          lastName: 'Doe',
          photo: null,
          userType: 'jobSeeker'
        }
      ];
      
      const user = demoUsers.find(u => u.email === credentials.email);
      
      if (!user) {
        return rejectWithValue('Invalid email or password');
      }
      
      // Verify password (in real app, this is done server-side)
      const isPasswordValid = await comparePasswords(credentials.password, user.password);
      
      if (!isPasswordValid) {
        return rejectWithValue('Invalid email or password');
      }
      
      // Generate a JWT-like token
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
        Buffer.from(JSON.stringify({ userId: user.id, email: user.email })).toString('base64') + 
        '.dummy_signature';
      
      // Save in localStorage (in real app, only store token, not user data for security)
      localStorage.setItem('userToken', token);
      localStorage.setItem('userData', JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        photo: user.photo,
        userType: user.userType
      }));
      
      return { 
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          photo: user.photo,
          userType: user.userType
        },
        token 
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

const storedState = loadUserState();

const initialState = {
  user: storedState.user,
  token: storedState.token,
  isAuthenticated: storedState.isAuthenticated,
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
      // Clear localStorage
      localStorage.removeItem('userToken');
      localStorage.removeItem('userData');
      
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Update localStorage
      if (state.user) {
        localStorage.setItem('userData', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || 'Registration failed';
        state.loading = false;
      })
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || 'Login failed'; 
        state.loading = false;
      });
  },
});

export const { setUserType, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;