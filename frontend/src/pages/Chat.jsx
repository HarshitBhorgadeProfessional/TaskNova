import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/axios';
import { Send, User } from 'lucide-react';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    let activeSocket = null;

    const fetchMessages = async () => {
      try {
        const { data } = await api.get('/api/chat');
        if (isMounted) setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchMessages();

    import('../lib/socket').then(({ default: socket }) => {
      activeSocket = socket;
      if (!isMounted) return;
      
      socket.connect();
      
      const handleNewMessage = (msg) => {
        setMessages((prev) => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      };
      
      socket.on('newMessage', handleNewMessage);
    });

    return () => {
      isMounted = false;
      if (activeSocket) {
        activeSocket.off('newMessage');
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    import('../lib/socket').then(({ default: socket }) => {
      socket.emit('sendMessage', {
        senderId: user._id,
        text: newMessage
      });
    });

    setNewMessage('');
  };

  if (loading) return <div className="flex h-full items-center justify-center text-slate-500">Loading chat...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-white dark:bg-[#0b1120] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
          Team Chat
          <span className="ml-3 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20">Live</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Collaborate with your team in real-time.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-transparent">
        {messages.map((msg, idx) => {
          const isMe = msg.sender?._id === user._id;
          return (
            <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                      {msg.sender?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {!isMe && <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1">{msg.sender?.name}</span>}
                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mx-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSendMessage} className="flex space-x-3 items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-100 dark:bg-[#111113] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 shadow-lg shadow-primary-500/30 transition-colors flex items-center justify-center"
          >
            <Send size={20} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
