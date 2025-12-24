import React, { useEffect } from 'react';
import TabBar from './TabBar';
import { MessageCircleHeart, Volume2, VolumeX, Sun, Moon, Sunset } from 'lucide-react';
import ChatModal from './ChatModal';
import { useTheme } from '../context/ThemeContext';
import { useChat } from '../context/ChatContext';
import { useAudio } from '../context/AudioContext';
import BackgroundAudio from './BackgroundAudio';

const Layout = ({ children, activeTab, onTabChange }) => {
  const { theme, cycleTheme } = useTheme();
  const { isChatOpen, openChat, closeChat } = useChat();
  const { isMuted, setIsMuted } = useAudio();

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const getThemeIcon = () => {
    switch(theme) {
      case 'day': return <Sun size={20} />;
      case 'dusk': return <Sunset size={20} />;
      case 'night': return <Moon size={20} />;
      default: return <Sun size={20} />;
    }
  };

  const toggleBgm = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className={`min-h-screen pb-20 relative overflow-hidden transition-colors duration-1000 bg-theme-${theme}`}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-theme-surface blur-3xl -z-10 rounded-b-full pointer-events-none opacity-30" />
      
      {/* Audio Player Component (Logic handled inside via context) */}
      <BackgroundAudio />

      {/* Top Right Theme Toggle */}
      <button 
        onClick={cycleTheme}
        className="fixed top-4 right-4 z-50 bg-theme-surface backdrop-blur-md p-3 rounded-full shadow-lg border border-theme text-theme-primary transition-all active:scale-95 hover:bg-theme-secondary hover:text-white"
        aria-label="Toggle Theme"
      >
        {getThemeIcon()}
      </button>

      {/* Main Content */}
      <main className="max-w-md mx-auto min-h-screen relative z-10">
        {children}
      </main>

      {/* Floating Controls */}
      <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3">
        {/* Audio Toggle */}
        <button
          onClick={toggleBgm}
          className="bg-theme-surface backdrop-blur-md p-3 rounded-full shadow-lg border border-theme text-theme-primary transition-all active:scale-95"
        >
          {!isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* AI Assistant Button */}
        <button
          onClick={openChat}
          className="btn-theme p-4 rounded-full shadow-lg shadow-gold-500/20 transition-transform active:scale-95"
          aria-label="AI Assistant"
        >
          <MessageCircleHeart size={28} strokeWidth={2} />
        </button>
      </div>

      {/* Chat Modal */}
      <ChatModal isOpen={isChatOpen} onClose={closeChat} />

      {/* Navigation */}
      <TabBar activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default Layout;
