import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const BriefcaseIcon = getIcon('Briefcase');
  const UserIcon = getIcon('User');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-surface-800 dark:text-white">
          Welcome to <span className="text-primary">TalentLink</span>
        </h1>
        <p className="text-xl mb-8 text-surface-600 dark:text-surface-300">
          Connect with the perfect job or find the ideal candidate for your business.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register/job-seeker" className="btn-primary py-3 px-6">
            <UserIcon className="mr-2" size={20} />Register as Job Seeker
          </Link>
          <Link to="/register/employer" className="btn-secondary py-3 px-6">
            <BriefcaseIcon className="mr-2" size={20} />Register as Employer
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;