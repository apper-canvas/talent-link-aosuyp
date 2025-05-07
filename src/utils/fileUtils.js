/**
 * Generates a URL for displaying an image file
 * @param {File} file - The image file
 * @returns {Promise<string>} - Image URL
 */
export const getImagePreviewUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.match('image.*')) {
      reject(new Error('Invalid file type. Please select an image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Validates if a file is an acceptable image type and within size limits
 * @param {File} file - The image file to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} - Validation result with status and message
 */
export const validateImageFile = (file, maxSize = 5 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }

  // Check file type
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: 'Invalid file type. Please select a JPG, PNG, GIF, or WebP image.' 
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      message: `File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.` 
    };
  }

  return { isValid: true };
};

/**
 * Validates if a file is an acceptable resume document type and within size limits
 * @param {File} file - The document file to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {Object} - Validation result with status and message
 */
export const validateResumeFile = (file, maxSize = 10 * 1024 * 1024) => {
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }

  // Check file type
  const validDocTypes = [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  const validExtensions = ['pdf', 'doc', 'docx'];
  
  if (!validDocTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
    return { isValid: false, message: 'Invalid file type. Please select a PDF (.pdf) or Word (.doc, .docx) document.' };
  }
  
  return { isValid: true };
};