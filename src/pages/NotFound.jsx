import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const NotFound = () => {
  const HomeIcon = getIcon('Home');
  const AlertTriangleIcon = getIcon('AlertTriangle');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 0.2,
              type: "spring",
              stiffness: 200
            }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary"
          >
            <AlertTriangleIcon size={48} />
          </motion.div>
        </div>
        
        <h1 className="text-6xl font-bold mb-4 text-surface-800 dark:text-white">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-surface-700 dark:text-surface-200">Page Not Found</h2>
        
        <p className="text-surface-600 dark:text-surface-300 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center px-6 py-3 text-lg"
          >
            <HomeIcon className="mr-2" size={20} />
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;