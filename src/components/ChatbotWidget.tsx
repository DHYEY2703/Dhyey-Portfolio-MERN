import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatbotWidgetProps {
  setActivePage?: (page: string) => void;
}

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ setActivePage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{sender: 'bot' | 'user', text: string}[]>([
    { sender: 'bot', text: "Hi! I am Dhyey's AI Assistant. Ask me anything about his skills, projects, or experience!" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user' as const, text: inputVal }];
    setMessages(newMessages);
    setInputVal('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputVal,
          // Pass history to maintain context
          conversationHistory: messages.slice(1) // exclude the first greeting message
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from OpenAI');

      const data = await response.json();
      let replyText = data.reply;

      // Extract and execute Navigation commands
      const navMatch = replyText.match(/<NAVIGATE:(about|resume|portfolio|blog|contact)>/i);
      if (navMatch) {
        const targetPage = navMatch[1].toLowerCase();
        replyText = replyText.replace(navMatch[0], '').trim();
        
        if (setActivePage) {
           // Small delay for dramatic effect after the message appears
           setTimeout(() => {
             setActivePage(targetPage);
           }, 1500);
        }
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: replyText }]);
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I am currently offline or experienced an error." }]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={{
              position: 'absolute',
              bottom: '70px',
              left: '0',
              width: '320px',
              height: '420px',
              backgroundColor: 'var(--eerie-black-1)',
              borderRadius: '15px',
              border: '1px solid var(--jet)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: '15px', 
              background: 'linear-gradient(to right, #2b2b2c, #1e1e1f)',
              borderBottom: '1px solid var(--jet)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#00ff88', boxShadow: '0 0 10px #00ff88' }} />
                <h4 style={{ margin: 0, color: 'var(--white-2)', fontSize: '15px' }}>Ask Dhyey AI</h4>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--light-gray)', cursor: 'pointer', fontSize: '20px' }}
              >
                &times;
              </button>
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((m, idx) => (
                <div key={idx} style={{ 
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: m.sender === 'user' ? 'var(--orange-yellow-crayola)' : 'var(--onyx)',
                  color: m.sender === 'user' ? '#000' : 'var(--light-gray)',
                  padding: '10px 14px',
                  borderRadius: m.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                  maxWidth: '85%',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {m.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '10px', borderTop: '1px solid var(--jet)', display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                style={{
                  flex: 1,
                  background: 'var(--smoky-black)',
                  border: '1px solid var(--jet)',
                  color: 'var(--white-2)',
                  padding: '10px 15px',
                  borderRadius: '20px',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
              <button 
                onClick={handleSend}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--orange-yellow-crayola)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#000',
                  boxShadow: '0 0 10px hsla(45, 100%, 72%, 0.3)'
                }}
              >
                {/*@ts-expect-error: custom element*/}
                <ion-icon name="send"></ion-icon>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'var(--orange-yellow-crayola)',
          color: 'var(--eerie-black-1)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 5px 20px hsla(45, 100%, 72%, 0.4)',
          fontSize: '24px'
        }}
      >
        {/*@ts-expect-error: custom element*/}
        <ion-icon name={isOpen ? 'close-outline' : 'chatbubbles-outline'}></ion-icon>
      </motion.button>
    </div>
  );
};

export default ChatbotWidget;
