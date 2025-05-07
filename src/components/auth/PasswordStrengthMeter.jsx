import React from 'react';
import { motion } from 'framer-motion';

/**
 * Password strength meter component that visually shows password strength
 * @param {Object} props - Component props
 * @param {number} props.score - Password strength score (0-4)
 * @param {string} props.feedback - Feedback message about password strength
 */
const PasswordStrengthMeter = ({ score, feedback }) => {
  // Hide meter when there's no score
  if (score === 0) return null;

  // Determine color based on score
  const getColor = () => {
    switch (score) {
      case 1: return 'bg-red-500'; // Very weak
      case 2: return 'bg-yellow-500'; // Weak
      case 3: return 'bg-green-400'; // Good
      case 4: return 'bg-green-600'; // Strong
      default: return 'bg-gray-300';
    }
  };

  // Calculate width percentage
  const getWidthPercentage = () => {
    return (score / 4) * 100;
  };

  return (
    <div className="mb-4 mt-1">
      <div className="h-1.5 w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${getWidthPercentage()}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full ${getColor()} rounded-full`}
        />
      </div>
      
      {feedback && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-xs mt-1.5 ${score >= 3 ? 'text-green-600 dark:text-green-400' : 'text-surface-500 dark:text-surface-400'}`}
        >
          {feedback}
        </motion.p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;

