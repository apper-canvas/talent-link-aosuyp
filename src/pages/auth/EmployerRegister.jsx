import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { registerUser, setUserType } from '../../store/slices/authSlice';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import FormInput from '../../components/FormInput';
import getIcon from '../../utils/iconUtils';

const EmployerRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, userType } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    position: '',
    industry: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If no user type is selected, set it to employer
    if (!userType) {
      dispatch(setUserType('employer'));
    }
  }, [userType, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate company fields
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.industry.trim()) newErrors.industry = 'Industry is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const userData = {
        ...formData,
        userType: 'employer',
      };
      
      await dispatch(registerUser(userData)).unwrap();
      toast.success('Registration successful! Welcome to TalentLink!');
      // In a real app, redirect to dashboard or login
      navigate('/');
    } catch (err) {
      toast.error(err || 'Registration failed. Please try again.');
    }
  };

  const ArrowLeftIcon = getIcon('ArrowLeft');
  const LogInIcon = getIcon('LogIn');

  return (
    <AuthLayout>
      <div className="mb-6">
        <Link to="/register" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeftIcon className="mr-1" size={16} />
          Back
        </Link>
      </div>

      <AuthHeader
        title="Create Employer Account"
        subtitle="Find the perfect candidates for your company"
        icon="Briefcase"
      />

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            required
            error={errors.firstName}
            icon="User"
            autoComplete="given-name"
          />

          <FormInput
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            required
            error={errors.lastName}
            icon="User"
            autoComplete="family-name"
          />
        </div>

        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@company.com"
          required
          error={errors.email}
          icon="Mail"
          autoComplete="email"
        />

        <FormInput
          label="Company Name"
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Acme Corporation"
          required
          error={errors.companyName}
          icon="Building"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Your Position"
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            placeholder="HR Manager"
            required
            error={errors.position}
            icon="Briefcase"
          />

          <FormInput
            label="Industry"
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="Technology"
            required
            error={errors.industry}
            icon="Globe"
          />
        </div>

        <FormInput
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
          error={errors.password}
          icon="Lock"
          autoComplete="new-password"
        />

        <FormInput
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          required
          error={errors.confirmPassword}
          icon="Lock"
          autoComplete="new-password"
        />

        <div className="mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-secondary w-full py-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </div>
      </form>

      <div className="text-center mt-6">
        <p className="text-surface-600 dark:text-surface-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Log in <LogInIcon className="inline" size={16} />
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default EmployerRegister;