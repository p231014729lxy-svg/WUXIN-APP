import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Play, Pause, Volume2, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

// Import Audio Files
import ziAudio from '../assets/audio/twelve_hours/zi.mp3';
import chouAudio from '../assets/audio/twelve_hours/chou.mp3';
import yinAudio from '../assets/audio/twelve_hours/yin.mp3';
import maoAudio from '../assets/audio/twelve_hours/mao.mp3';
import chenAudio from '../assets/audio/twelve_hours/chen.mp3';
import siAudio from '../assets/audio/twelve_hours/si.mp3';
import wuAudio from '../assets/audio/twelve_hours/wu.mp3';
import weiAudio from '../assets/audio/twelve_hours/wei.mp3';
import shenAudio from '../assets/audio/twelve_hours/shen.mp3';
import youAudio from '../assets/audio/twelve_hours/you.mp3';
import xuAudio from '../assets/audio/twelve_hours/xu.mp3';
import haiAudio from '../assets/audio/twelve_hours/hai.mp3';

const TypingText = ({ text, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, index + 1));
      index++;
      if (index === text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <p className="text-theme-primary text-lg font-serif text-center leading-relaxed">{displayedText}</p>;
};

const CountdownTimer = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <div className="w-24 h-24 rounded-full border-4 border-[var(--color-accent)] flex items-center justify-center text-2xl font-mono text-theme-primary animate-pulse">
        {timeLeft}s
      </div>
      <p className="text-theme-secondary text-sm mt-2">专注当下</p>
    </div>
  );
};

const TwelveHoursModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('reminder'); // 'reminder' or 'training'
  const [trainingState, setTrainingState] = useState('idle'); // 'idle', 'playing', 'countdown', 'finished'
  const audioRef = useRef(null);

  // Time Order Keys
  const timeOrder = ['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'];

  // Time-based Content Configuration
  const timeConfigs = {
    zi: { range: [23, 0], name: '子时 (23:00-1:00)', audio: ziAudio, text: '胆经当令 · 一阳初生，入睡好时辰', training: null },
    chou: { range: [1, 2], name: '丑时 (1:00-3:00)', audio: chouAudio, text: '肝经当令 · 熟睡养肝，排毒养颜', training: null },
    yin: { range: [3, 4], name: '寅时 (3:00-5:00)', audio: yinAudio, text: '肺经当令 · 深度睡眠，气血分配', training: null },
    mao: { range: [5, 6], name: '卯时 (5:00-7:00)', audio: maoAudio, text: '大肠经当令 · 东方既白，舒展身心', training: null },
    chen: { range: [7, 8], name: '辰时 (7:00-9:00)', audio: chenAudio, text: '胃经当令 · 早餐宜温，营养吸收', training: { name: '叩齿咽津', duration: 30, desc: '轻叩牙齿36下，缓缓吞咽唾液，促进消化。' } },
    si: { range: [9, 10], name: '巳时 (9:00-11:00)', audio: siAudio, text: '脾经当令 · 精力充沛，工作学习', training: null },
    wu: { range: [11, 12], name: '午时 (11:00-13:00)', audio: wuAudio, text: '心经当令 · 心肾相交，小憩养神', training: null },
    wei: { range: [13, 14], name: '未时 (13:00-15:00)', audio: weiAudio, text: '小肠经当令 · 分清泌浊，保护血管', training: { name: '腹式呼吸', duration: 60, desc: '深吸气腹部隆起，慢呼气腹部内收，帮助吸收。' } },
    shen: { range: [15, 16], name: '申时 (15:00-17:00)', audio: shenAudio, text: '膀胱经当令 · 多喝温水，排毒利尿', training: null },
    you: { range: [17, 18], name: '酉时 (17:00-19:00)', audio: youAudio, text: '肾经当令 · 补肾藏精，不宜过劳', training: null },
    xu: { range: [19, 20], name: '戌时 (19:00-21:00)', audio: xuAudio, text: '心包经当令 · 快乐养心，放松心情', training: { name: '劳宫穴对搓', duration: 60, desc: '双手掌心相对，快速搓热劳宫穴，平复心绪。' } },
    hai: { range: [21, 22], name: '亥时 (21:00-23:00)', audio: haiAudio, text: '三焦经当令 · 休养生息，准备入眠', training: null },
  };

  // Calculate initial time key
  const getInitialTimeKey = () => {
    const h = new Date().getHours();
    if (h >= 23 || h < 1) return 'zi';
    if (h >= 1 && h < 3) return 'chou';
    if (h >= 3 && h < 5) return 'yin';
    if (h >= 5 && h < 7) return 'mao';
    if (h >= 7 && h < 9) return 'chen';
    if (h >= 9 && h < 11) return 'si';
    if (h >= 11 && h < 13) return 'wu';
    if (h >= 13 && h < 15) return 'wei';
    if (h >= 15 && h < 17) return 'shen';
    if (h >= 17 && h < 19) return 'you';
    if (h >= 19 && h < 21) return 'xu';
    return 'hai'; // 21-23
  };

  const [selectedTimeKey, setSelectedTimeKey] = useState(getInitialTimeKey());

  const config = timeConfigs[selectedTimeKey];

  const handlePrevTime = () => {
    const currentIndex = timeOrder.indexOf(selectedTimeKey);
    const prevIndex = (currentIndex - 1 + timeOrder.length) % timeOrder.length;
    setSelectedTimeKey(timeOrder[prevIndex]);
    setTrainingState('idle'); // Reset training state
  };

  const handleNextTime = () => {
    const currentIndex = timeOrder.indexOf(selectedTimeKey);
    const nextIndex = (currentIndex + 1) % timeOrder.length;
    setSelectedTimeKey(timeOrder[nextIndex]);
    setTrainingState('idle'); // Reset training state
  };

  // Reset to current time when modal opens
  useEffect(() => {
      if (isOpen) {
          setSelectedTimeKey(getInitialTimeKey());
      }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && activeTab === 'reminder' && config.audio) {
      // Stop previous audio if any (simple implementation, relying on new Audio object replacement)
      // In a more robust app, we might track the audio instance to pause it explicitly before creating new.
      const audio = new Audio(config.audio);
      audio.volume = 0.6;
      audio.play().catch(e => console.log("Autoplay blocked", e));
      
      // Cleanup function to stop audio when effect re-runs (time changes) or unmounts
      return () => {
          audio.pause();
          audio.currentTime = 0;
      };
    }
  }, [isOpen, activeTab, selectedTimeKey]); // Depend on selectedTimeKey to re-trigger on switch

  const startTraining = () => {
    setTrainingState('playing');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[var(--color-bg-primary)] border border-theme rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-theme flex justify-between items-center bg-theme-surface">
              <div className="flex items-center gap-2">
                <Clock className="text-theme-primary" size={20} />
                <h3 className="font-serif text-theme-primary text-lg">十二时辰养生</h3>
              </div>
              <button onClick={onClose} className="p-1 text-theme-secondary hover:text-theme-primary rounded-full hover:bg-theme-surface">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
              
              {/* Tabs */}
              <div className="flex p-1 bg-theme-surface rounded-xl border border-theme mb-8 w-full">
                <button 
                  onClick={() => { setActiveTab('reminder'); setTrainingState('idle'); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'reminder' ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] shadow-sm' : 'text-theme-secondary'}`}
                >
                  时辰提醒
                </button>
                <button 
                  onClick={() => { setActiveTab('training'); setTrainingState('idle'); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'training' ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] shadow-sm' : 'text-theme-secondary'}`}
                >
                  微训练
                </button>
              </div>

              {activeTab === 'reminder' && (
                <div className="text-center w-full">
                  <div className="w-32 h-32 mx-auto bg-theme-surface rounded-full flex items-center justify-center mb-6 relative border border-theme">
                    <div className="absolute inset-0 border border-[var(--color-accent)] rounded-full animate-ping opacity-20" />
                    <Volume2 size={40} className="text-[var(--color-accent)]" />
                  </div>
                  
                  {/* Time Switcher */}
                  <div className="flex items-center justify-between mb-2 w-full px-4">
                      <button onClick={handlePrevTime} className="p-2 rounded-full hover:bg-theme-surface text-theme-secondary hover:text-theme-primary transition-colors">
                          <ChevronLeft size={24} />
                      </button>
                      <h2 className="text-2xl font-serif text-theme-primary">{config.name}</h2>
                      <button onClick={handleNextTime} className="p-2 rounded-full hover:bg-theme-surface text-theme-secondary hover:text-theme-primary transition-colors">
                          <ChevronRight size={24} />
                      </button>
                  </div>

                  <p className="text-theme-secondary opacity-80 text-sm mb-8">{config.text}</p>
                  
                  {config.audio ? (
                    <div className="flex items-center justify-center gap-2 text-xs text-theme-secondary opacity-60">
                      <Activity size={14} className="animate-pulse" /> 正在播放时辰音效
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-xs text-theme-secondary opacity-40">
                      <Volume2 size={14} /> 当前时辰暂无专属音效
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'training' && (
                <div className="text-center w-full">
                  {/* Time Switcher for Training Tab too */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                      <button onClick={handlePrevTime} className="text-theme-secondary hover:text-theme-primary"><ChevronLeft size={20} /></button>
                      <span className="text-sm font-serif text-theme-primary opacity-80">{config.name}</span>
                      <button onClick={handleNextTime} className="text-theme-secondary hover:text-theme-primary"><ChevronRight size={20} /></button>
                  </div>

                  {!config.training ? (
                    <div className="py-10 text-theme-secondary opacity-60">
                      <p>当前时辰暂无特定微训练</p>
                      <p className="text-xs mt-2">请切换至辰时、未时或戌时体验</p>
                    </div>
                  ) : (
                    <>
                      {trainingState === 'idle' && (
                        <div className="animate-in fade-in zoom-in duration-300">
                          <h3 className="text-2xl font-serif text-theme-primary mb-4">{config.training.name}</h3>
                          <p className="text-theme-secondary text-sm mb-8 px-4">{config.training.desc}</p>
                          <button 
                            onClick={startTraining}
                            className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-[var(--color-bg-primary)] shadow-lg hover:scale-105 transition-transform mx-auto"
                          >
                            <Play size={28} fill="currentColor" className="ml-1" />
                          </button>
                          <p className="text-xs text-theme-secondary mt-4 opacity-60">点击开始训练</p>
                        </div>
                      )}

                      {trainingState === 'playing' && (
                        <div className="w-full">
                           <TypingText 
                              text={config.training.desc} 
                              speed={100} 
                              onComplete={() => setTrainingState('countdown')} 
                           />
                        </div>
                      )}

                      {trainingState === 'countdown' && (
                        <CountdownTimer 
                          duration={config.training.duration} 
                          onComplete={() => setTrainingState('finished')} 
                        />
                      )}

                      {trainingState === 'finished' && (
                        <div className="animate-in fade-in zoom-in duration-500">
                          <div className="w-20 h-20 bg-theme-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-theme">
                            <Activity size={32} className="text-[var(--color-accent)]" />
                          </div>
                          <h3 className="text-xl font-serif text-theme-primary mb-2">训练完成</h3>
                          <p className="text-theme-secondary text-sm">身心已获片刻滋养</p>
                          <button 
                            onClick={() => setTrainingState('idle')}
                            className="mt-8 text-theme-secondary hover:text-theme-primary underline text-sm"
                          >
                            再次练习
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TwelveHoursModal;
