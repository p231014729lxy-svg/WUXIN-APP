import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import backMusic from '../assets/audio/back.mp3';

const Splash = ({ onEnter }) => {
  const audioRef = useRef(null);
  const [showPlayHint, setShowPlayHint] = React.useState(false);

  useEffect(() => {
    // Play back.mp3 on mount
    const playAudio = async () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.5;
            try {
                await audioRef.current.play();
            } catch (e) {
                console.log("Splash audio autoplay blocked", e);
                setShowPlayHint(true);
                
                // Add one-time interaction listener
                const startPlay = () => {
                    if (audioRef.current) {
                        audioRef.current.play().catch(err => console.log("Still failed", err));
                        setShowPlayHint(false);
                    }
                    window.removeEventListener('click', startPlay);
                    window.removeEventListener('touchstart', startPlay);
                };
                
                window.addEventListener('click', startPlay);
                window.addEventListener('touchstart', startPlay);
                
                return () => {
                    window.removeEventListener('click', startPlay);
                    window.removeEventListener('touchstart', startPlay);
                };
            }
        }
    };
    
    playAudio();

    // Stop on unmount
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };
  }, []);

  const handleEnterClick = () => {
      if (audioRef.current) {
          // Fade out effect could be added here, but simple pause is requested
          audioRef.current.pause();
      }
      onEnter();
  };

  return (
    <div className="min-h-screen bg-primary-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Audio for Splash Only */}
      <audio ref={audioRef} src={backMusic} loop />

      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 blur-[100px] rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500/10 blur-[100px] rounded-full animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="z-10 text-center"
      >
        {/* Logo Representation */}
        <div className="mb-12 relative">
          <div className="w-40 h-40 mx-auto border-2 border-primary-500/30 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 border border-gold-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
            <h1 className="text-8xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-primary-200 to-primary-600 drop-shadow-lg">
              吾心
            </h1>
          </div>
          <p className="mt-4 text-primary-400/60 text-lg font-serif tracking-widest">W U X I N</p>
        </div>

        {/* Enter Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnterClick}
          className="bg-white text-primary-900 text-xl font-medium py-3 px-12 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all"
        >
          进入冥想
        </motion.button>
      </motion.div>
      
      <div className="absolute bottom-10 text-primary-500/30 text-xs flex flex-col items-center gap-2">
        <p>Connect with your inner self</p>
        {showPlayHint && (
            <p className="animate-pulse text-[var(--color-accent)] opacity-80">
                ( 点击屏幕播放背景音效 )
            </p>
        )}
      </div>
    </div>
  );
};

export default Splash;
