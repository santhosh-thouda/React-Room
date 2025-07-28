import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Layout from '../../components/layout/Layout';
import ChatPanel from '../../components/chat/ChatPanel';
import ComponentPreview from '../../components/preview/ComponentPreview';

export default function SessionPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const [sessionData, setSessionData] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentCode, setCurrentCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shouldBlink, setShouldBlink] = useState(false);

  useEffect(() => {
    if (id && session) {
      fetchSessionData();
    }
  }, [id, session]);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/sessions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data.session);
        console.log('Loaded session data:', data.session);
        console.log('Chat history:', data.session.chatHistory);
        // Check each assistant message for code property
        data.session.chatHistory.forEach((msg, index) => {
          if (msg.role === 'assistant') {
            console.log(`Assistant message ${index}:`, msg);
            console.log(`Has code property:`, !!msg.code);
            if (msg.code) {
              console.log(`Code content:`, msg.code);
            }
          }
        });
        setChatHistory(data.session.chatHistory || []);
        // Set currentCode from session or from most recent assistant message
        let codeToSet = data.session.currentCode || null;
        if (!codeToSet) {
          const lastAssistantMessage = data.session.chatHistory
            ?.filter(msg => msg.role === 'assistant' && msg.code)
            ?.pop();
          if (lastAssistantMessage) {
            codeToSet = lastAssistantMessage.code;
            console.log('Using code from last assistant message as fallback:', codeToSet);
          }
        }
        setCurrentCode(codeToSet);
      } else if (response.status === 404) {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageSent = async (message) => {
    const newChatHistory = [...chatHistory, message];
    setChatHistory(newChatHistory);
    
    // Auto-save session
    await saveSession(newChatHistory, currentCode);
  };

  const handleCodeGenerated = async (code, aiMessage) => {
    // Attach code to the aiMessage for later reference
    const aiMsgWithCode = { ...aiMessage, code };
    console.log('Saving aiMsgWithCode:', aiMsgWithCode);
    setCurrentCode(code);
    const newChatHistory = [...chatHistory, aiMsgWithCode];
    setChatHistory(newChatHistory);
    await saveSession(newChatHistory, code);
  };

  const saveSession = async (chatHistory, code) => {
    try {
      console.log('Saving chatHistory:', chatHistory);
      await fetch(`/api/sessions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatHistory,
          currentCode: code,
        }),
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  // Handler to set preview to the code of the clicked assistant message
  const handlePromptClick = (code) => {
    console.log('Setting current code to:', code);
    setCurrentCode(code);
    setShouldBlink(true);
    setTimeout(() => setShouldBlink(false), 500); // 500ms blink
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (!sessionData) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-500">Session not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen">
        {/* Main Preview Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              {sessionData.name}
            </h1>
          </div>
          <div className="flex-1">
            <ComponentPreview 
              code={currentCode} 
              onCodeChange={setCurrentCode}
              shouldBlink={shouldBlink}
            />
          </div>
        </div>
        
        {/* Chat Panel */}
        <div className="w-96">
          {console.log('Passing currentCode to ChatPanel:', currentCode)}
          <ChatPanel
            sessionId={id}
            onCodeGenerated={handleCodeGenerated}
            chatHistory={chatHistory}
            onMessageSent={handleMessageSent}
            onPromptClick={handlePromptClick}
            currentCode={currentCode}
          />
        </div>
      </div>
    </Layout>
  );
} 