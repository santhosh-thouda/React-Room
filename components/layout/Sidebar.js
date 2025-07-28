import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiClock, FiFolder, FiChevronRight } from 'react-icons/fi';

export default function Sidebar() {
  const { data: session } = useSession();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchSessions();
    }
  }, [session]);

  const formatSessionDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }) + ' ' + new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        const processedSessions = data.sessions.map(session => ({
          ...session,
          displayName: getDisplayName(session)
        }));
        setSessions(processedSessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (session) => {
    if (!session.chatHistory || session.chatHistory.length === 0) {
      return session.name || `Session ${formatSessionDate(session.createdAt)}`;
    }
    
    const lastUserMessage = [...session.chatHistory].reverse()
      .find(msg => msg.role === 'user');
    
    return lastUserMessage?.content?.substring(0, 50) + 
      (lastUserMessage?.content?.length > 50 ? '...' : '') || 
      session.name || `Session ${formatSessionDate(session.createdAt)}`;
  };

  const createNewSession = async () => {
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
      
      if (response.ok) {
        const newSession = await response.json();
        setSessions([{
          ...newSession,
          displayName: 'New Session'
        }, ...sessions]);
        window.location.href = `/session/${newSession._id}`;
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  return (
    <div className="w-72 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 h-screen shadow-xl">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            Chat Sessions
          </h2>
          <button
            onClick={createNewSession}
            className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg cursor-pointer"
          >
            <FiPlus className="inline mr-1" />
            New
          </button>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-800/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mb-4">
              <div className="flex items-center text-xs uppercase tracking-wider text-gray-400 mb-2">
                <FiClock className="mr-2" />
                Recent Chats
              </div>
              
              {sessions.slice(0, 5).map((session) => (
                <Link
                  key={session._id}
                  href={`/session/${session._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-all group"
                >
                  <span className="text-sm text-gray-200 group-hover:text-white truncate">
                    {session.displayName}
                  </span>
                  <FiChevronRight className="text-gray-400 group-hover:text-white" />
                </Link>
              ))}
            </div>

            {sessions.length > 5 && (
              <div>
                <div className="flex items-center text-xs uppercase tracking-wider text-gray-400 mb-2">
                  <FiFolder className="mr-2" />
                  All Chats
                </div>
                
                {sessions.slice(5).map((session) => (
                  <Link
                    key={session._id}
                    href={`/session/${session._id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-all group"
                  >
                    <span className="text-sm text-gray-200 group-hover:text-white truncate">
                      {session.displayName}
                    </span>
                    <FiChevronRight className="text-gray-400 group-hover:text-white" />
                  </Link>
                ))}
              </div>
            )}

            {sessions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No chat sessions yet
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}