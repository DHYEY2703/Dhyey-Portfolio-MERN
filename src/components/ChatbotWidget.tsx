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
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSpeakingRef = useRef(false);
  const wakeWordRecognizerRef = useRef<any>(null);
  const commandLockRef = useRef(false);

  // --- WAKE WORD: ALWAYS LISTENING ENGINE ---
  useEffect(() => {
    if (!wakeWordEnabled) {
      if (wakeWordRecognizerRef.current) {
        wakeWordRecognizerRef.current.onend = null;
        wakeWordRecognizerRef.current.stop();
        wakeWordRecognizerRef.current = null;
      }
      return;
    }

    // @ts-expect-error
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      setWakeWordEnabled(false);
      return;
    }

    const recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = false; // Wait for full sentence pauses
    recognizer.lang = 'en-US';

    recognizer.onresult = (event: any) => {
      // Don't listen to our own TTS voice
      if (isSpeakingRef.current) return;

      const latestPhrase = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      if (!latestPhrase) return;

      // 1. If we're already waiting for their question (Mic is glowing green)
      if (commandLockRef.current) {
        commandLockRef.current = false; // lock released
        setIsListening(false); // mic stops glowing
        setInputVal(latestPhrase);
        handleSend(latestPhrase, true);
        return;
      }

      // 2. Otherwise, we are passively listening for the Wake Word
      if (latestPhrase.includes('dj') || latestPhrase.includes('hey dj')) {
         // ✨ WAKE WORD DETECTED ✨
         commandLockRef.current = true; // Now wait for question on next breath
         setIsListening(true); // Mic glows green securely
         setIsOpen(true);
         isSpeakingRef.current = true; 

         if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("I am here.");
            utterance.onend = () => { isSpeakingRef.current = false; };
            window.speechSynthesis.speak(utterance);
         } else {
            isSpeakingRef.current = false;
         }
      }
    };

    recognizer.onend = () => {
       // Loop endlessly
       if (wakeWordEnabled) {
           try { recognizer.start(); } catch(e) {}
       }
    };

    try {
      recognizer.start();
      wakeWordRecognizerRef.current = recognizer;
    } catch(e) {}

    return () => {
      if (wakeWordRecognizerRef.current) {
         wakeWordRecognizerRef.current.onend = null;
         wakeWordRecognizerRef.current.stop();
      }
    };
  }, [wakeWordEnabled]);
  // ------------------------------------------

  const suggestions = [
    "What is your tech stack?",
    "Tell me about the RMS ERP",
    "Show me his resume",
    "How can I contact Dhyey?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      const cleanText = text.replace(/<NAVIGATE:.*?>/g, '').replace(/\*/g, '').trim();
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      
      utterance.onstart = () => { isSpeakingRef.current = true; };
      utterance.onend = () => { 
        isSpeakingRef.current = false; 
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  function handleVoiceInput() {
    // If background listener is already acting as host, borrow it!
    if (wakeWordEnabled) {
      commandLockRef.current = true;
      setIsListening(true);
      return;
    }

    // @ts-expect-error: WebKit prefix
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputVal(transcript);
      handleSend(transcript, true);
    };
    recognition.start();
  };

  async function handleSend(overrideText?: string, useVoiceResponse?: boolean) {
    const textToSend = typeof overrideText === 'string' ? overrideText : inputVal;
    if (!textToSend.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setInputVal('');
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: textToSend,
          conversationHistory: messages.slice(1) // exclude the first greeting message
        })
      });

      if (!response.ok) throw new Error('Failed to fetch from AI Server');

      setIsLoading(false); // Stop bouncy dots instantly when we attach to the stream
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let botReply = '';

      // Create the bot's empty message bubble to fill
      setMessages((prev) => [...prev, { sender: 'bot', text: '' }]);

      let readBuffer = '';
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          readBuffer += decoder.decode(value, { stream: true });
          
          let eventEndIndex;
          // Robust SSE Accumulator
          while ((eventEndIndex = readBuffer.indexOf('\n\n')) >= 0) {
            const chunk = readBuffer.slice(0, eventEndIndex);
            readBuffer = readBuffer.slice(eventEndIndex + 2);
            
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6).trim();
                if (dataStr === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(dataStr);
                  botReply += parsed.text;
                  
                  // Instantly stream onto the screen!
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = { ...updated[updated.length - 1], text: botReply };
                    return updated;
                  });
                } catch (e) {}
              }
            }
          }
        }
      }

      // After streaming completely finishes, check if AI triggered a skill
      const navMatch = botReply.match(/<NAVIGATE:(about|resume|portfolio|blog|contact)>/i);
      if (navMatch) {
        const targetPage = navMatch[1].toLowerCase();
        botReply = botReply.replace(navMatch[0], '').trim();
        
        // Strip the command from the UI
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], text: botReply };
          return updated;
        });

        if (setActivePage) {
           setTimeout(() => setActivePage(targetPage), 1500);
        }
      }

      if (useVoiceResponse) {
        speakText(botReply);
      }

    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages((prev) => [...prev, { sender: 'bot', text: "Sorry, I am currently offline or experienced an error." }]);
    } finally {
      setIsLoading(false);
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
                <h4 style={{ margin: 0, color: 'var(--white-2)', fontSize: '15px' }}>Ask DJ</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Wake Word Toggle */}
                <button 
                  onClick={() => setWakeWordEnabled(!wakeWordEnabled)}
                  title="Hands-free 'Hey DJ'"
                  style={{
                    background: wakeWordEnabled ? 'rgba(0, 255, 136, 0.15)' : 'transparent',
                    border: wakeWordEnabled ? '1px solid #00ff88' : '1px solid var(--jet)',
                    color: wakeWordEnabled ? '#00ff88' : 'var(--light-gray)',
                    padding: '4px 8px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.3s'
                  }}
                >
                  {/*@ts-expect-error: custom*/}
                  <ion-icon name={wakeWordEnabled ? "mic" : "mic-off-outline"}></ion-icon>
                  Hey DJ
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--light-gray)', cursor: 'pointer', fontSize: '20px' }}
                >
                  &times;
                </button>
              </div>
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
              
              {messages.length === 1 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
                  {suggestions.map((s, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSend(s)}
                      style={{
                        background: 'var(--border-gradient-onyx)',
                        border: '1px solid var(--jet)',
                        color: 'var(--white-2)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background 0.3s'
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.background = 'var(--bg-gradient-yellow-1)')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'var(--border-gradient-onyx)')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div style={{
                  alignSelf: 'flex-start',
                  backgroundColor: 'var(--onyx)',
                  color: 'var(--light-gray)',
                  padding: '10px 14px',
                  borderRadius: '15px 15px 15px 0',
                  fontSize: '14px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center'
                }}>
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, backgroundColor: 'var(--light-gray)', borderRadius: '50%' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, backgroundColor: 'var(--light-gray)', borderRadius: '50%' }} />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, backgroundColor: 'var(--light-gray)', borderRadius: '50%' }} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '10px', borderTop: '1px solid var(--jet)', display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Ask a question..."}
                style={{
                  flex: 1,
                  background: isListening ? 'rgba(0, 255, 136, 0.1)' : 'var(--smoky-black)',
                  border: isListening ? '1px solid #00ff88' : '1px solid var(--jet)',
                  color: 'var(--white-2)',
                  padding: '10px 15px',
                  borderRadius: '20px',
                  outline: 'none',
                  fontSize: '14px',
                  transition: 'all 0.3s ease'
                }}
              />
              {/* Mic Button */}
              <button 
                onClick={handleVoiceInput}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: isListening ? '#ff4757' : 'var(--jet)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'var(--white-2)',
                  boxShadow: isListening ? '0 0 15px rgba(255,71,87,0.5)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {/*@ts-expect-error: custom element*/}
                <ion-icon name={isListening ? "mic" : "mic-outline"}></ion-icon>
              </button>
              {/* Send Button */}
              <button 
                onClick={() => handleSend()}
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
