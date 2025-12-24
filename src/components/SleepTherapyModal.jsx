import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Play, Pause, ChevronRight } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

const TypingText = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      index++;
      if (index === text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <p className="text-theme-secondary text-sm leading-relaxed">{displayedText}</p>;
};

const Countdown = ({ minutes = 20 }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 flex flex-col items-center justify-center">
        <div className="text-4xl font-mono text-theme-primary mb-4 font-bold tracking-widest">
            {formatTime(timeLeft)}
        </div>
        <button 
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
        >
            {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
    </div>
  );
};

const SleepTherapyModal = ({ isOpen, onClose }) => {
  const [activeModule, setActiveModule] = useState(null); // null, 'acupoint', 'footbath', 'guide'
  const [subSelection, setSubSelection] = useState(null);
  
  // Acupoint Data
  const acupointData = {
    anxiety: { 
        title: '焦虑失眠', 
        points: '神门穴、内关穴', 
        desc: '神门穴位于手腕内侧，小指侧腕横纹处；内关穴位于前臂掌侧，腕横纹上2寸。配合深呼吸，按揉3-5分钟。',
        videoUrl: '/videos/anxiety.mp4'
    },
    overthinking: { 
        title: '黑眼圈重', 
        points: '承泣穴、四白穴', 
        desc: '承泣穴位于瞳孔直下，眼球与眶下缘之间；四白穴位于眶下孔凹陷处。轻柔按压，改善眼部循环。',
        videoUrl: '/videos/dark_circles.mp4'
    },
    videoPlaceholder: '（此处为专业中医师穴位示范短视频）'
  };

  // Foot Bath Data
  const footBathData = {
    mugwort: { title: '艾叶暖足方', desc: '艾叶50g，煮水泡脚。温经散寒，助眠安神。' },
    ginger: { title: '生姜驱寒方', desc: '生姜50g，拍碎煮水。促进血液循环，改善手脚冰凉。' },
    safflower: { title: '红花活血方', desc: '红花10g，纱布包煮。活血化瘀，缓解日间疲劳。' }
  };

  const handleReset = () => {
    setActiveModule(null);
    setSubSelection(null);
  };

  const renderContent = () => {
    if (!activeModule) {
      return (
        <div className="space-y-3">
          <button onClick={() => setActiveModule('acupoint')} className="w-full p-4 bg-theme-surface border border-theme rounded-xl text-left hover:bg-theme-surface/80 transition-all flex justify-between items-center group">
            <div>
                <h4 className="text-theme-primary font-medium">穴位按摩</h4>
                <p className="text-xs text-theme-secondary opacity-60">疏通经络，安神定志</p>
            </div>
            <ChevronRight size={20} className="text-theme-secondary group-hover:text-[var(--color-accent)]" />
          </button>
          <button onClick={() => setActiveModule('footbath')} className="w-full p-4 bg-theme-surface border border-theme rounded-xl text-left hover:bg-theme-surface/80 transition-all flex justify-between items-center group">
            <div>
                <h4 className="text-theme-primary font-medium">药浴足疗</h4>
                <p className="text-xs text-theme-secondary opacity-60">引火归元，温润身心</p>
            </div>
            <ChevronRight size={20} className="text-theme-secondary group-hover:text-[var(--color-accent)]" />
          </button>
          <button onClick={() => setActiveModule('guide')} className="w-full p-4 bg-theme-surface border border-theme rounded-xl text-left hover:bg-theme-surface/80 transition-all flex justify-between items-center group">
            <div>
                <h4 className="text-theme-primary font-medium">睡前导引</h4>
                <p className="text-xs text-theme-secondary opacity-60">身体扫描，放松入眠</p>
            </div>
            <ChevronRight size={20} className="text-theme-secondary group-hover:text-[var(--color-accent)]" />
          </button>
        </div>
      );
    }

    if (activeModule === 'acupoint') {
      return (
        <div className="space-y-4">
          <h4 className="text-theme-primary font-medium mb-2">选择症状：</h4>
          <div className="flex gap-2 mb-4">
            <button 
                onClick={() => setSubSelection('anxiety')}
                className={`flex-1 py-2 rounded-lg text-sm border border-theme transition-all ${subSelection === 'anxiety' ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)]' : 'text-theme-secondary'}`}
            >
                焦虑失眠
            </button>
            <button 
                onClick={() => setSubSelection('overthinking')}
                className={`flex-1 py-2 rounded-lg text-sm border border-theme transition-all ${subSelection === 'overthinking' ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)]' : 'text-theme-secondary'}`}
            >
                黑眼圈重
            </button>
          </div>
          
          {subSelection && (
            <div className="bg-theme-surface border border-theme rounded-2xl p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="block aspect-video bg-black/10 rounded-xl mb-4 overflow-hidden relative group">
                  <video 
                     key={subSelection}
                     src={acupointData[subSelection].videoUrl} 
                     controls 
                     playsInline
                     className="w-full h-full object-cover"
                     onClick={(e) => e.stopPropagation()}
                  />
               </div>
               <h5 className="text-theme-primary font-bold mb-2">{acupointData[subSelection].title} · {acupointData[subSelection].points}</h5>
               <TypingText text={acupointData[subSelection].desc} />
            </div>
          )}
        </div>
      );
    }

    if (activeModule === 'footbath') {
        return (
            <div className="space-y-4">
                <h4 className="text-theme-primary font-medium mb-2">经典配方库：</h4>
                <div className="grid grid-cols-1 gap-3">
                    {Object.entries(footBathData).map(([key, data]) => (
                        <button 
                            key={key}
                            onClick={() => setSubSelection(key)}
                            className={`p-3 rounded-xl border text-left transition-all ${subSelection === key ? 'bg-[var(--color-accent)]/10 border-[var(--color-accent)]' : 'bg-theme-surface border-theme'}`}
                        >
                            <h5 className="text-theme-primary font-medium text-sm">{data.title}</h5>
                            <p className="text-theme-secondary text-xs opacity-70 mt-1">{data.desc}</p>
                        </button>
                    ))}
                </div>

                {subSelection && (
                    <div className="mt-6 pt-6 border-t border-theme">
                        <h4 className="text-theme-primary font-medium mb-4 flex items-center gap-2">
                            <Moon size={18} /> 足浴伴侣模式
                        </h4>
                        <div className="bg-theme-surface border border-theme rounded-2xl p-6 text-center">
                            <TypingText text="水温适宜，请开始泡脚。放松双肩，闭上眼睛..." />
                            <Countdown minutes={20} />
                            <p className="text-xs text-theme-secondary mt-3 opacity-60">20分钟倒计时</p>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    if (activeModule === 'guide') {
        return (
            <div className="bg-theme-surface border border-theme rounded-2xl p-6">
                <TypingText text="请平躺在床上，轻轻闭上双眼。感受呼吸的起伏... 现在，将注意力集中在你的脚趾，慢慢放松..." speed={50} />
            </div>
        )
    }
  };

  // Audio Ref
  const audioRef = useRef(null);
  const { playExclusive, stopExclusive } = useAudio();
  const PLAYER_ID = 'sleep-therapy-audio';

  useEffect(() => {
    // We cannot use activeModule to determine play/pause directly because
    // activeModule controls the view, but not necessarily the playback state.
    // However, the original code had `isPlaying` state logic that seems missing in the provided snippet.
    // Assuming we want to stop audio when modal closes or unmounts.
    
    return () => {
        stopExclusive(PLAYER_ID);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          {/* Audio Element */}
          <audio ref={audioRef} src={sleepMusic} loop />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[var(--color-bg-primary)] border border-theme rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-theme flex justify-between items-center bg-theme-surface">
              <div className="flex items-center gap-2">
                {activeModule && (
                    <button onClick={handleReset} className="mr-2 text-theme-secondary hover:text-theme-primary">
                        <ChevronRight size={20} className="rotate-180" />
                    </button>
                )}
                <Moon className="text-theme-primary" size={20} />
                <h3 className="font-serif text-theme-primary text-lg">安寝方</h3>
              </div>
              <button onClick={onClose} className="p-1 text-theme-secondary hover:text-theme-primary rounded-full hover:bg-theme-surface">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {renderContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SleepTherapyModal;
