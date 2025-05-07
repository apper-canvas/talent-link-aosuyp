import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Auth Pages
import Register from './pages/auth/Register';
import JobSeekerRegister from './pages/auth/JobSeekerRegister';
import EmployerRegister from './pages/auth/EmployerRegister';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import CandidateProfile from './pages/profile/CandidateProfile';

// Components
import getIcon from './utils/iconUtils';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  
  return (
    <>
      <div className="relative min-h-screen">
        {/* Dark Mode Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface-200 dark:bg-surface-700 shadow-soft"
          onClick={toggleDarkMode}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
        </motion.button>
        
        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Authentication Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/register/job-seeker" element={<JobSeekerRegister />} />
            <Route path="/register/employer" element={<EmployerRegister />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            
            <Route path="/profile" element={<ProtectedRoute><CandidateProfile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16 md:mt-20"
      />
    </>
  );
}

export default App;