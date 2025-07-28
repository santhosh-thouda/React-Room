import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogIn, FiLogOut, FiUser, FiZap } from 'react-icons/fi';
import { FaReact } from 'react-icons/fa';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl sticky top-0 z-50 border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Animated Logo */}
          <Link href="/" className="flex items-center group">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative"
            >
              <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <FaReact className="text-cyan-400 text-3xl" />
                </motion.div>
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-extrabold text-2xl tracking-tighter"
                >
                  REACT ROOM
                </motion.span>
                <motion.div 
                  animate={{ 
                    y: [0, -3, 0],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20"
                >
                  PRO
                </motion.div>
              </div>
            </motion.div>
          </Link>

          {/* Auth Section */}
          <div className="flex items-center space-x-3">
            <AnimatePresence mode="wait">
              {session ? (
                <motion.div
                  key="user-section"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center space-x-4"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-full pl-1 pr-3 py-1 border border-gray-700 cursor-pointer transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                      <FiUser className="text-lg" />
                    </div>
                    <span className="text-sm font-medium text-gray-200 hidden sm:inline-block">
                      {session.user.name?.split(' ')[0] || session.user.email?.split('@')[0]}
                    </span>
                  </motion.div>

                  <motion.button
                    whileHover={{ 
                      scale: 1.03,
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => signOut()}
                    className="flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
                  >
                    <FiLogOut className="text-white" />
                    <span>Sign Out</span>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  key="signin-button"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ 
                    scale: 1.03,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => signIn()}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                >
                  <FiLogIn className="text-white" />
                  <span>Sign In</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}