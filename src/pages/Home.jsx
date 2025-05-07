import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

const Home = () => {
  const [activeTab, setActiveTab] = useState('jobSeeker');
  
  const BriefcaseIcon = getIcon('Briefcase');
  const BuildingIcon = getIcon('Building');
  const ArrowDownIcon = getIcon('ArrowDown');
  const SearchIcon = getIcon('Search');
  const FileTextIcon = getIcon('FileText');
  const UsersIcon = getIcon('Users');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-primary dark:from-primary-dark dark:to-primary pt-20 pb-32">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1622675363311-3e1904dc1885')] bg-cover opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Connecting <span className="text-secondary-light">Talent</span> with <span className="text-secondary-light">Opportunity</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto lg:mx-0">
                  TalentLink bridges the gap between exceptional candidates and forward-thinking employers.
                </p>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                  <button 
                    className={`px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                      activeTab === 'jobSeeker' 
                        ? 'bg-white text-primary shadow-lg' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => setActiveTab('jobSeeker')}
                  >
                    <div className="flex items-center gap-2">
                      <BriefcaseIcon size={20} />
                      <span>Job Seekers</span>
                    </div>
                  </button>
                  
                  <button 
                    className={`px-8 py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
                      activeTab === 'employer' 
                        ? 'bg-white text-primary shadow-lg' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => setActiveTab('employer')}
                  >
                    <div className="flex items-center gap-2">
                      <BuildingIcon size={20} />
                      <span>Employers</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-md w-full"
              >
                <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-surface-800 dark:text-white mb-6">
                      {activeTab === 'jobSeeker' ? 'Find Your Dream Job' : 'Find Perfect Candidates'}
                    </h3>
                    
                    <MainFeature userType={activeTab} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
          >
            <button 
              onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-surface-700 shadow-lg text-primary"
              aria-label="Scroll to features"
            >
              <ArrowDownIcon size={24} />
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How TalentLink Works</h2>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto">
              Our platform streamlines the recruitment process, making it easier for job seekers to find opportunities and employers to find talent.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Feature 1 */}
            <motion.div 
              variants={itemVariants}
              className="neu-card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-6">
                <SearchIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Discover Opportunities</h3>
              <p className="text-surface-600 dark:text-surface-300">
                Search through thousands of job listings filtered to match your skills and career goals.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              variants={itemVariants}
              className="neu-card flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-secondary/10 text-secondary mb-6">
                <FileTextIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Resume Management</h3>
              <p className="text-surface-600 dark:text-surface-300">
                Upload and manage your resume, allowing employers to find you based on your qualifications.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              variants={itemVariants} 
              className="neu-card flex flex-col items-center text-center md:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-6">
                <UsersIcon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">Candidate Shortlisting</h3>
              <p className="text-surface-600 dark:text-surface-300">
                Employers can easily shortlist and manage candidates throughout the hiring process.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-surface-100 dark:bg-surface-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Career or Team?</h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 mb-8">
              Whether you're looking for your next opportunity or the perfect candidate, TalentLink has you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg py-3 px-8"
                onClick={() => toast.success("You're on the right track! This feature would be available in the full version.")}
              >
                Get Started Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline text-lg py-3 px-8"
                onClick={() => toast.info("Learn more functionality would be available in the full version.")}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-surface-800 dark:bg-surface-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">TalentLink</h3>
              <p className="text-surface-300">Connecting talent with opportunity</p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-surface-300 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); toast.info("This would link to About Us in the full version."); }}>About</a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); toast.info("This would link to Contact in the full version."); }}>Contact</a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); toast.info("This would link to Privacy Policy in the full version."); }}>Privacy</a>
              <a href="#" className="text-surface-300 hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); toast.info("This would link to Terms in the full version."); }}>Terms</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-surface-700 text-center text-surface-400 text-sm">
            © {new Date().getFullYear()} TalentLink. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;