import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

/**
 * Protected route component that redirects to login if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  const location = useLocation();
  const LoaderIcon = getIcon('Loader');

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <LoaderIcon size={30} className="text-primary" />
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;