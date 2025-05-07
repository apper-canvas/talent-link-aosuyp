import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

/**
 * Custom hook to handle authentication state and actions
 * @returns {Object} Auth state and methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, token } = useSelector(state => state.auth);

  // Handle user logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Return authentication state and actions
  return {
    user,
    isAuthenticated,
    loading,
    error,
    token,
    logout: handleLogout,
  };
};

export default useAuth;