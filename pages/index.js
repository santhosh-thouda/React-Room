import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCode, FiEye, FiDownload } from 'react-icons/fi';
import Layout from '../components/layout/Layout';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (session) {
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `Session ${new Date().toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            })} ${new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}`
          }),
        });
        
        const newSession = await response.json();
        router.push(`/session/${newSession._id}`);
      } catch (error) {
        console.error('Error creating session:', error);
      }
    } else {
      router.push('/auth/signin');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
        <motion.div 
          initial="hidden"
          animate="show"
          variants={container}
          className="max-w-6xl mx-auto w-full"
        >
          <motion.div 
            variants={item}
            className="text-center mb-12 px-4"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                React Room
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto">
              AI-Powered Component Generator for React Developers
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
              Transform your ideas into production-ready React components with natural language.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetStarted}
              className="relative group bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <span className="relative z-10 flex items-center justify-center">
                {session ? 'Start Creating' : 'Get Started'}
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            {!session && (
              <p className="text-gray-500 mt-4">
                Sign in to save your progress and access all features
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
            <motion.div 
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 flex flex-col items-center text-center h-full"
            >
              <div className="text-blue-600 text-3xl mb-4 p-3 bg-blue-50 rounded-full">
                <FiCode />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">AI-Powered Generation</h3>
              <p className="text-gray-600">
                Describe components in plain English and get clean, production-ready React code.
              </p>
            </motion.div>

            <motion.div 
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 flex flex-col items-center text-center h-full"
            >
              <div className="text-indigo-600 text-3xl mb-4 p-3 bg-indigo-50 rounded-full">
                <FiEye />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Real-Time Preview</h3>
              <p className="text-gray-600">
                See your components render instantly as you refine them with the AI.
              </p>
            </motion.div>

            <motion.div 
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200 flex flex-col items-center text-center h-full"
            >
              <div className="text-purple-600 text-3xl mb-4 p-3 bg-purple-50 rounded-full">
                <FiDownload />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Export & Share</h3>
              <p className="text-gray-600">
                Save your work and export components directly to your projects.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}