import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from '../../utils/iconUtils';
import FormInput from '../FormInput';
import { saveProfile } from '../../store/slices/profileSlice';

const PlusIcon = getIcon('Plus');
const CodeIcon = getIcon('Code');
const XIcon = getIcon('X');
const CheckIcon = getIcon('Check');

const SkillsManager = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector(state => state.profile);
  
  // State for skills
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('intermediate'); // beginner, intermediate, advanced, expert
  
  // Load existing skills
  useEffect(() => {
    if (profile && profile.skills) {
      setSkills(profile.skills);
    }
  }, [profile]);
  
  // Handle skill input change
  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };
  
  // Handle skill level change
  const handleLevelChange = (e) => {
    setSkillLevel(e.target.value);
  };
  
  // Add new skill
  const addSkill = (e) => {
    e.preventDefault();
    
    if (!newSkill.trim()) {
      toast.error('Please enter a skill');
      return;
    }
    
    // Check if skill already exists
    if (skills.some(skill => skill.name.toLowerCase() === newSkill.toLowerCase())) {
      toast.error('This skill already exists in your profile');
      return;
    }
    
    const updatedSkills = [
      ...skills,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: newSkill.trim(),
        level: skillLevel
      }
    ];
    
    setSkills(updatedSkills);
    setNewSkill('');
    
    // Save to profile
    dispatch(saveProfile({
      ...profile,
      skills: updatedSkills
    }))
      .unwrap()
      .then(() => {
        toast.success('Skill added successfully');
      })
      .catch((error) => {
        toast.error(error || 'Failed to add skill');
      });
  };
  
  // Remove skill
  const removeSkill = (skillId) => {
    const updatedSkills = skills.filter(skill => skill.id !== skillId);
    setSkills(updatedSkills);
    
    // Save to profile
    dispatch(saveProfile({
      ...profile,
      skills: updatedSkills
    }))
      .unwrap()
      .then(() => {
        toast.success('Skill removed successfully');
      })
      .catch((error) => {
        toast.error(error || 'Failed to remove skill');
      });
  };
  
  // Get color for skill level
  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'intermediate':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'expert':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300';
    }
  };
  
  return (
    <div>
      {/* Add New Skill Form */}
      <form onSubmit={addSkill} className="mb-8">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <FormInput
              label="Add a Skill"
              name="newSkill"
              value={newSkill}
              onChange={handleSkillChange}
              placeholder="e.g., JavaScript, Project Management, UX Design"
              icon="Code"
              required
            />
          </div>
          
          <div className="md:w-1/3">
            <label htmlFor="skillLevel" className="form-label">Skill Level</label>
            <select
              id="skillLevel"
              name="skillLevel"
              value={skillLevel}
              onChange={handleLevelChange}
              className="form-input"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div className="md:flex md:items-end md:pb-1">
            <button 
              type="submit" 
              className="btn-primary w-full md:w-auto mt-3 md:mt-0"
              disabled={loading}
            >
              <PlusIcon size={16} className="mr-2" />
              Add Skill
            </button>
          </div>
        </div>
      </form>
      
      {/* Skills List */}
      {skills.length === 0 ? (
        <div className="text-center py-8">
          <CodeIcon size={48} className="mx-auto text-surface-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No Skills Added</h3>
          <p className="text-surface-500">Add your skills to showcase your capabilities to employers</p>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-4">Your Skills</h3>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`inline-flex items-center px-3 py-1 rounded-full ${getLevelColor(skill.level)}`}
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="ml-2 text-surface-500 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <XIcon size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Skill categories */}
          <div className="mt-8">
            <h4 className="text-sm font-medium mb-2">Skill Levels:</h4>
            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                <span className="text-xs">Beginner</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                <span className="text-xs">Intermediate</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                <span className="text-xs">Advanced</span>
              </div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                <span className="text-xs">Expert</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsManager;