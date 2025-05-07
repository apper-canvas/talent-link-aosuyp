/**
 * Password utility functions for hashing, validation, and comparison
 * In a real application, password hashing would be done server-side
 */

// Simulate password hashing (in a real app, this would be done server-side with bcrypt)
export const hashPassword = async (password) => {
  // In a real application, we would use bcrypt here
  // This is just a simplified simulation for demo purposes
  return new Promise(resolve => {
    setTimeout(() => {
      // This is NOT secure - it's just a simulation for demo purposes
      // Real apps should use bcrypt on the server
      const hashedPassword = `hashed_${password}_${Date.now()}`;
      resolve(hashedPassword);
    }, 100);
  });
};

// Simulate password comparison (in a real app, this would be done server-side with bcrypt)
export const comparePasswords = async (plainPassword, hashedPassword) => {
  // In a real application, we would use bcrypt.compare here
  // This is just a simplified simulation for demo purposes
  return new Promise(resolve => {
    setTimeout(() => {
      // This is NOT secure - it's just a simulation for demo purposes
      const isMatch = hashedPassword.includes(`hashed_${plainPassword}_`);
      resolve(isMatch);
    }, 100);
  });
};

// Validate password strength
export const validatePassword = (password) => {
  // Initialize response object
  const result = {
    isValid: false,
    score: 0,
    message: ''
  };

  // Empty password
  if (!password) {
    result.message = 'Password is required';
    return result;
  }

  // Check length
  if (password.length < 8) {
    result.score = 1;
    result.message = 'Password is too short (minimum 8 characters)';
    return result;
  }

  // Check complexity using regex
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Calculate score based on criteria met
  result.score = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  // Determine feedback based on score
  switch (result.score) {
    case 1:
      result.message = 'Very weak - add uppercase, numbers, and special characters';
      break;
    case 2:
      result.message = 'Weak - add more character types for stronger security';
      break;
    case 3:
      result.message = 'Good - consider adding one more character type';
      result.isValid = true;
      break;
    case 4:
      result.message = 'Very strong password';
      result.isValid = true;
      break;
    default:
      result.message = 'Invalid password';
  }

  return result;
};