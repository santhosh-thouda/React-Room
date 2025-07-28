import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { FiLoader } from 'react-icons/fi';

const Layout = ({ children }) => {
  const { data: session, status } = useSession();

  // Loading animation variants
  const loaderVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { opacity: 0 }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <motion.div
          variants={loaderVariants}
          initial="initial"
          animate="animate"
          className="text-4xl text-cyan-400 mb-4"
        >
          <FiLoader />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
        >
          Loading Your Workspace
        </motion.h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="flex">
        <AnimatePresence>
          {session && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed h-[calc(100vh-4rem)] z-20"
            >
              <Sidebar />
            </motion.aside>
          )}
        </AnimatePresence>

        <motion.main
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
            session ? 'md:ml-72' : ''
          }`}
        >
          <div className="p-6 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={session ? 'authenticated' : 'guest'}
                variants={pageVariants}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;