import { motion } from 'framer-motion';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-8">
          {children}
        </div>
        
        <p className="text-center text-sm text-surface-500 dark:text-surface-400">
          © {new Date().getFullYear()} TalentLink. 
          All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;