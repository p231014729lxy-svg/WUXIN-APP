import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, Mic, Volume2, Play, Pause } from 'lucide-react';
import { chatWithAI } from '../services/deepseek';
import { useToast } from '../context/ToastContext';

const ChatModal = ({ isOpen, onClose }) => {
  const { showToast } = useToast() || {}; // Fallback to avoid destructuring error if context is missing, though provider should be there.
  
  // Safe showToast function
  const safeShowToast = (msg) => {
      if (showToast) {
          showToast(msg);
      } else {
          console.warn("Toast context not available");
          alert(msg); // Fallback
      }
  };

  const [messages, setMessages] = useState([
    { role: 'assistant', content: '您好，我是您的心声伴侣。今日心情如何？有什么想和我聊聊的吗？', type: 'text' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Audio Recording Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const isHoldingRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    await processAIResponse(userMsg);
  };

  const processAIResponse = async (userMsg) => {
    try {
      let contextContent = userMsg.content;
      if (userMsg.type === 'audio') {
          contextContent = "（用户发送了一段语音，表达了倾诉的欲望）"; 
      }

      const context = [
        { role: 'system', content: '你是一个温柔、智慧的中医心理咨询师，名叫“心声伴侣”。你的语气平和、富有同理心，结合中医养生知识和心理学为用户排忧解难。如果用户发送的是语音（标记为语音消息），请礼貌地回应你听到了，并引导用户继续倾诉或给出建议。' },
        ...messages.filter(m => m.type === 'text').map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: contextContent }
      ];
      
      const reply = await chatWithAI(context);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, type: 'text' }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我现在有点累了，请稍后再试。', type: 'text' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // If user released while waiting for permission, abort
      if (!isHoldingRef.current) {
          stream.getTracks().forEach(track => track.stop());
          return;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleSendAudio(audioUrl);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Add global listeners to ensure we catch release even if cursor moves
      window.addEventListener('mouseup', handleGlobalRelease);
      window.addEventListener('touchend', handleGlobalRelease);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("无法访问麦克风，请检查权限设置。");
      setIsRecording(false);
      isHoldingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    
    // Clean up listeners
    window.removeEventListener('mouseup', handleGlobalRelease);
    window.removeEventListener('touchend', handleGlobalRelease);
  };

  const handleGlobalRelease = () => {
      isHoldingRef.current = false;
      stopRecording();
  };

  const handleRecordStart = (e) => {
    e.preventDefault();
    isHoldingRef.current = true;
    startRecording();
  };

  const handleRecordEnd = (e) => {
    e.preventDefault();
    isHoldingRef.current = false;
    stopRecording();
  };

  const handleSendAudio = (audioUrl) => {
      const userMsg = { role: 'user', content: '语音消息', type: 'audio', audioUrl };
      setMessages(prev => [...prev, userMsg]);
      setIsLoading(true);
      processAIResponse(userMsg);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="w-full max-w-md h-[80vh] bg-[var(--color-bg-primary)] border-t border-theme rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col relative overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-theme flex justify-between items-center bg-theme-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-theme-surface flex items-center justify-center border border-theme">
                  <Bot className="text-[var(--color-accent)]" size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-theme-primary text-lg">心声伴侣</h3>
                  <p className="text-xs text-theme-secondary opacity-80">您的私人疗愈顾问</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-theme-surface rounded-full text-theme-secondary hover:text-theme-primary transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] rounded-br-none' 
                      : 'bg-theme-surface text-theme-primary rounded-bl-none border border-theme'
                  }`}>
                    {msg.type === 'text' ? (
                        <>
                            {msg.content}
                            {msg.role === 'assistant' && (
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-theme/20">
                                    <button 
                                        onClick={() => showToast("功能正在开发中，请稍后")}
                                        className="flex items-center gap-2 hover:opacity-80"
                                    >
                                        <Volume2 size={14} className="text-theme-secondary cursor-pointer hover:text-theme-primary" />
                                        <span className="text-[10px] text-theme-secondary">点击朗读</span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center gap-2 min-w-[120px]">
                            <audio src={msg.audioUrl} controls className="h-8 w-48 opacity-90" />
                        </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-theme-surface p-4 rounded-2xl rounded-bl-none border border-theme flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-theme-secondary" />
                    <span className="text-xs text-theme-secondary">正在倾听...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-theme bg-theme-surface relative select-none">
              {isRecording && (
                  <div className="absolute inset-0 bg-theme-surface/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-theme-primary pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center mb-2 animate-pulse">
                          <Mic size={32} className="text-[var(--color-accent)]" />
                      </div>
                      <span className="text-sm font-medium">松开结束录音</span>
                  </div>
              )}
              
              <div className="flex gap-2 items-center">
                <button
                    onMouseDown={handleRecordStart}
                    onMouseUp={handleRecordEnd}
                    onTouchStart={handleRecordStart}
                    onTouchEnd={handleRecordEnd}
                    className="p-3 rounded-full text-theme-secondary hover:bg-theme-primary/10 transition-colors active:scale-95 touch-none"
                    title="长按录音"
                >
                    <Mic size={24} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="说出你的心事..."
                  className="flex-1 bg-[var(--color-bg-primary)] border border-theme rounded-full px-4 py-3 text-theme-primary placeholder-theme-secondary/50 focus:outline-none focus:ring-1 focus:ring-theme-primary transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="w-12 h-12 bg-[var(--color-accent)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-[var(--color-bg-primary)] rounded-full flex items-center justify-center transition-all shadow-md"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
