import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { loginUser } from '../../store/slices/authSlice';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import FormInput from '../../components/FormInput';
import getIcon from '../../utils/iconUtils';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  // Get redirect path from location state, default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Show error from state if present
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      await dispatch(loginUser({
        email: formData.email,
        password: formData.password
      })).unwrap();
      
      toast.success('Login successful! Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the rejected action and displayed from the useEffect
    }
  };

  const UserIcon = getIcon('User');
  const ArrowRightIcon = getIcon('ArrowRight');

  return (
    <AuthLayout>
      <AuthHeader
        title="Welcome Back"
        subtitle="Log in to access your TalentLink account"
        icon="LogIn"
      />

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
          error={formErrors.email}
          icon="Mail"
          autoComplete="email"
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          error={formErrors.password}
          icon="Lock"
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between mb-6">
          <label className="inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-primary focus:ring-primary border-surface-300 dark:border-surface-600 rounded transition-all duration-200" 
            />
            <span className="ml-2 text-sm text-surface-700 dark:text-surface-300">Remember me</span>
          </label>
          
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary w-full py-3 justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                Log In <ArrowRightIcon className="ml-2" size={18} />
              </>
            )}
          </motion.button>
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-surface-600 dark:text-surface-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up <UserIcon className="inline" size={16} />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;