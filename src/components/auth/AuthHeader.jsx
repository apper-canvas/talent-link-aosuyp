import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../../utils/iconUtils';

const AuthHeader = ({ title, subtitle, icon }) => {
  const IconComponent = icon ? getIcon(icon) : null;
  
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-block mb-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-3xl font-bold text-primary"
        >
          {IconComponent && <IconComponent className="inline mr-2" size={28} />}
          TalentLink
        </motion.div>
      </Link>
      
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
      
      {subtitle && <p className="text-surface-600 dark:text-surface-400">{subtitle}</p>}
    </div>
  );
};

export default AuthHeader;