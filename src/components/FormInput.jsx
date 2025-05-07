import { useState } from 'react';
import getIcon from '../utils/iconUtils';

const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  icon,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const IconComponent = icon ? getIcon(icon) : null;
  const EyeIcon = getIcon('Eye');
  const EyeOffIcon = getIcon('EyeOff');
  
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`relative flex items-center ${error ? 'mb-1' : ''}`}>
        {IconComponent && (
          <div className="absolute left-3 text-surface-500 dark:text-surface-400">
            <IconComponent size={18} />
          </div>
        )}
        
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`form-input ${IconComponent ? 'pl-10' : ''} ${type === 'password' ? 'pr-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : ''} ${isFocused ? 'ring-2 ring-primary border-transparent' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 text-surface-500 dark:text-surface-400"
            onClick={togglePasswordVisibility}
            tabIndex="-1"
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormInput;