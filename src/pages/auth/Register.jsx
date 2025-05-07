import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { setUserType } from '../../store/slices/authSlice';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthHeader from '../../components/auth/AuthHeader';
import getIcon from '../../utils/iconUtils';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userType } = useSelector(state => state.auth);

  const UserIcon = getIcon('User');
  const BriefcaseIcon = getIcon('Briefcase');
  const LogInIcon = getIcon('LogIn');

  useEffect(() => {
    // Reset user type when visiting the register page
    dispatch(setUserType(null));
  }, [dispatch]);

  const handleUserTypeSelection = (type) => {
    dispatch(setUserType(type));
    
    if (type === 'jobSeeker') {
      navigate('/register/job-seeker');
    } else {
      navigate('/register/employer');
    }
  };

  return (
    <AuthLayout>
      <AuthHeader 
        title="Create an Account" 
        subtitle="Choose how you want to use TalentLink" 
        icon="UserPlus"
      />
      
      <div className="flex flex-col gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center p-4 border-2 border-primary/20 hover:border-primary rounded-xl bg-white dark:bg-surface-700 shadow-sm"
          onClick={() => handleUserTypeSelection('jobSeeker')}
        >
          <div className="h-12 w-12 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-4">
            <UserIcon size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold">Job Seeker</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">Find jobs & build your career</p>
          </div>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center p-4 border-2 border-secondary/20 hover:border-secondary rounded-xl bg-white dark:bg-surface-700 shadow-sm"
          onClick={() => handleUserTypeSelection('employer')}
        >
          <div className="h-12 w-12 flex items-center justify-center bg-secondary/10 text-secondary rounded-full mr-4">
            <BriefcaseIcon size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold">Employer</h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">Post jobs & find talent</p>
          </div>
        </motion.button>
      </div>
      
      <div className="text-center mt-8">
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

export default Register;