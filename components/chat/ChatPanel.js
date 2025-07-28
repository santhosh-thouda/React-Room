import { useState, useRef, useEffect } from 'react';
import { FiSend, FiImage, FiX, FiRotateCw } from 'react-icons/fi';

export default function ChatPanel({ sessionId, onCodeGenerated, chatHistory, onMessageSent, onPromptClick }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Load saved prompt on mount
  useEffect(() => {
    const savedIndex = localStorage.getItem('selectedPromptIndex');
    if (savedIndex !== null && chatHistory.length > 0) {
      const idx = parseInt(savedIndex, 10);
      const savedMsg = chatHistory[idx];
      if (savedMsg && savedMsg.code) {
        onPromptClick(savedMsg.code);
      }
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && !imageFile) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append('message', message);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('sessionId', sessionId);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        onMessageSent({
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        });

        if (data.aiMessage) {
          onCodeGenerated(data.code, data.aiMessage);
        }

        setMessage('');
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <h3 className="text-lg font-semibold text-white">AI Chat Assistant</h3>
        <button
          onClick={() => {
            localStorage.removeItem('selectedPromptIndex');
            alert('Prompt selection has been reset.');
          }}
          className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
        >
          Reset Selection
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-3 rounded-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-white border border-gray-700'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="flex flex-col">
                  <button
                    className={`text-left focus:outline-none ${
                      msg.code ? 'hover:text-blue-300 cursor-pointer' : 'text-gray-400 cursor-not-allowed'
                    }`}
                    style={{ background: 'none', border: 'none', padding: 0, margin: 0 }}
                    onClick={() => {
                      if (msg.code) {
                        localStorage.setItem('selectedPromptIndex', index);
                        onPromptClick(msg.code);
                      } else {
                        alert('No code available for this message.');
                      }
                    }}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </button>
                  {!msg.code && (
                    <span className="text-xs text-gray-500 mt-1">(No generated code)</span>
                  )}
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
              {msg.image && (
                <div className="mt-2">
                  <img
                    src={msg.image}
                    alt="Uploaded content"
                    className="rounded-lg max-w-full h-auto max-h-48 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2">
                <FiRotateCw className="animate-spin h-4 w-4" />
                <span className="text-sm">Generating response...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
        {imagePreview && (
          <div className="mb-3 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-lg max-h-32 object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-gray-900 rounded-full p-1 hover:bg-gray-700 transition-colors"
            >
              <FiX className="h-4 w-4 text-white" />
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <label className="cursor-pointer p-2 rounded-full hover:bg-gray-700 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isLoading}
            />
            <FiImage className="h-5 w-5 text-gray-400 hover:text-blue-400" />
          </label>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the component you want to create..."
            className="flex-1 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-900 text-white placeholder-gray-500"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || (!message.trim() && !imageFile)}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 text-white transition-colors"
            aria-label="Send message"
          >
            <FiSend className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}