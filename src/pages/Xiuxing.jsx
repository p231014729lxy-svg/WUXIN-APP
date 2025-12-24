import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useAudio } from '../context/AudioContext';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { Music, Clock, BookOpen, Moon, Play, Pause, SkipForward, Volume2, ArrowLeft, ArrowRight, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TwelveHoursModal from '../components/TwelveHoursModal';
import AncientWisdomModal from '../components/AncientWisdomModal';
import SleepTherapyModal from '../components/SleepTherapyModal';

// Imports for General Player
import sleepMusic from '../assets/audio/sleep.mp3';
import waterMusic from '../assets/audio/water.mp3';
import fiveTonesGeneral from '../assets/audio/wuyin_general.mp3';

// Imports for Five Tones
import gongMusic from '../assets/audio/gong.mp3';
import shangMusic from '../assets/audio/shang.mp3';
import jueMusic from '../assets/audio/jue.mp3';
import zhiMusic from '../assets/audio/zhi.mp3';
import yuMusic from '../assets/audio/yu.mp3';

const GeneralPlayerCard = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const { playExclusive, stopExclusive, activePlayer } = useAudio();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const { showToast } = useToast();
  const PLAYER_ID = 'general-player';

  const tracks = [
    { title: "宁心安神", src: sleepMusic },
    { title: "山涧流水", src: waterMusic },
    { title: "五音养脏", src: fiveTonesGeneral }
  ];

  // Sync with global exclusive state
  useEffect(() => {
    if (activePlayer !== PLAYER_ID && isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    }
  }, [activePlayer]);

  const togglePlay = () => {
    if (!user) {
        showToast("请先登录以使用此功能");
        navigateTo('personal');
        return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopExclusive(PLAYER_ID);
    } else {
      // Start playing
      playExclusive(PLAYER_ID);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    // If we were playing, keep playing. If not, just switch track.
    // User expectation: usually next -> auto play
    if (!isPlaying) {
        playExclusive(PLAYER_ID);
        setIsPlaying(true);
    }
  };
  
  // Effect to handle source change and autoplay
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.load();
        if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
        }
    }
  }, [currentTrackIndex]);

  return (
    <div className="bg-theme-surface border border-theme p-6 rounded-3xl shadow-xl mb-6 relative overflow-hidden group">
      <audio ref={audioRef} src={tracks[currentTrackIndex].src} onEnded={nextTrack} />
      
      {/* Decorative */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--color-accent)] opacity-10 rounded-full blur-3xl" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-serif text-theme-primary mb-1">随心听</h3>
          <p className="text-theme-secondary text-xs opacity-80">当前播放: {tracks[currentTrackIndex].title}</p>
        </div>
        <div className="p-2 rounded-full bg-theme-primary/10 text-theme-primary">
          <ListMusic size={20} />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10 bg-theme-primary/5 p-3 rounded-2xl">
        <button 
          onClick={togglePlay}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95 bg-[var(--color-accent)] text-[var(--color-bg-primary)]"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        
        <div className="flex-1 mx-4">
             {/* Simple visualizer bars */}
             <div className="flex items-end justify-center gap-1 h-8">
                 {[...Array(12)].map((_, i) => (
                     <div 
                        key={i} 
                        className={`w-1 rounded-t-full transition-all duration-300 ${isPlaying ? 'bg-[var(--color-accent)]' : 'bg-theme-secondary/30'}`}
                        style={{ height: isPlaying ? `${Math.random() * 100}%` : '20%' }}
                     />
                 ))}
             </div>
        </div>

        <button onClick={nextTrack} className="text-theme-secondary hover:text-theme-primary transition-colors">
            <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};

const FiveTonesEntryCard = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="w-full bg-theme-surface border border-theme p-6 rounded-3xl shadow-xl mb-8 relative overflow-hidden group text-left transition-all active:scale-[0.98]"
    >
      {/* Decorative Circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-theme-primary opacity-10 rounded-full blur-3xl" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-2xl font-serif text-theme-primary mb-1">五音疗法</h3>
          <p className="text-theme-secondary text-sm">宫商角徵羽 · 调理脏腑</p>
        </div>
        <div 
            className="p-2 rounded-full"
            style={{ backgroundColor: 'var(--color-card-icon-bg)', color: 'var(--color-card-icon-fg)' }}
        >
          <Music size={20} />
        </div>
      </div>

      <div className="w-full h-1 bg-theme-primary opacity-10 rounded-full mb-6 relative z-10 overflow-hidden">
        <div className="w-1/3 h-full bg-theme-primary opacity-80 rounded-full" />
      </div>

      <div className="flex items-center justify-between relative z-10">
         <span className="text-xs text-theme-secondary opacity-60">点击进入专属疗愈空间</span>
         <ArrowRight size={20} className="text-[var(--color-accent)]" />
      </div>
    </button>
);

const TonePlayer = ({ title, organ, element, src, color }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const { playExclusive, stopExclusive, activePlayer } = useAudio();
    const { user } = useUser();
    const { navigateTo } = useNavigation();
    const { showToast } = useToast(); // Use toast context if available, or pass it down. Assuming useToast is available in this scope or imported.
    // Wait, TonePlayer is defined outside Xiuxing, need to make sure hooks work. Yes they are functional components.
    // Need to ensure useToast is imported at top level. It is.
    const PLAYER_ID = `tone-${title}`;

    useEffect(() => {
        if (activePlayer !== PLAYER_ID && isPlaying) {
            setIsPlaying(false);
            audioRef.current?.pause();
        }
    }, [activePlayer]);

    // Stop on unmount
    useEffect(() => {
        return () => {
            if (isPlaying) {
                stopExclusive(PLAYER_ID);
            }
        };
    }, []);

    const toggle = () => {
        if (!user) {
            // Need to handle toast. Since useToast is hook, we need to call it inside component.
            // But showToast comes from useToast hook which I need to call.
            // I'll call it at top of TonePlayer.
            showToast("请先登录以聆听五音");
            navigateTo('personal');
            return;
        }

        if(isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            stopExclusive(PLAYER_ID);
        } else {
            playExclusive(PLAYER_ID);
            audioRef.current.play();
            setIsPlaying(true);
        }
    }

    return (
        <div className="bg-theme-surface/50 border border-theme p-4 rounded-2xl mb-3 flex items-center justify-between">
            <audio ref={audioRef} src={src} onEnded={() => { setIsPlaying(false); stopExclusive(PLAYER_ID); }} />
            <div className="flex items-center gap-4">
                <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-bg-primary)] font-bold shadow-md`}
                    style={{ backgroundColor: color }}
                >
                    {title[0]}
                </div>
                <div>
                    <h4 className="text-theme-primary font-medium">{title}</h4>
                    <p className="text-xs text-theme-secondary opacity-70">{organ} · {element}</p>
                </div>
            </div>
            <button 
                onClick={toggle}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-theme-surface border border-theme text-theme-primary hover:bg-theme-primary hover:text-[var(--color-bg-primary)] transition-all"
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
            </button>
        </div>
    );
}

const FiveTonesDetail = ({ onBack }) => {
    const tones = [
        { title: "宫音", organ: "脾", element: "土", src: gongMusic, color: "#EDB120" }, // Yellow
        { title: "商音", organ: "肺", element: "金", src: shangMusic, color: "#A0A0A0" }, // White/Grey
        { title: "角音", organ: "肝", element: "木", src: jueMusic, color: "#4CAF50" },   // Green
        { title: "徵音", organ: "心", element: "火", src: zhiMusic, color: "#F44336" },   // Red
        { title: "羽音", organ: "肾", element: "水", src: yuMusic, color: "#2196F3" }    // Blue
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 pt-12 pb-24 min-h-screen"
        >
            <header className="mb-8 flex items-center gap-4">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-theme-surface transition-colors text-theme-primary">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-2xl font-serif text-theme-primary">五音疗愈</h2>
                    <p className="text-xs text-theme-secondary opacity-80">五音对五脏，身心共调和</p>
                </div>
            </header>

            <div className="space-y-4">
                {tones.map((tone, idx) => (
                    <TonePlayer key={idx} {...tone} />
                ))}
            </div>
            
            <div className="mt-8 p-4 bg-theme-surface/30 rounded-xl border border-theme/50 text-xs text-theme-secondary opacity-70 leading-relaxed">
                <p>💡 <strong>温馨提示：</strong></p>
                <p>建议佩戴耳机聆听。根据自身体质或不适症状，选择对应的音律进行重点聆听。每次聆听15-30分钟为宜。</p>
            </div>
        </motion.div>
    );
};

const SectionItem = ({ icon: Icon, title, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 w-full p-4 bg-theme-surface hover:bg-theme-surface/80 border border-theme rounded-xl transition-all mb-3 group text-left shadow-sm"
  >
    <div 
        className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
        style={{ backgroundColor: 'var(--color-card-icon-bg)', color: 'var(--color-card-icon-fg)' }}
    >
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-theme-primary font-medium mb-0.5">{title}</h4>
      <p className="text-theme-secondary opacity-60 text-xs">{desc}</p>
    </div>
  </button>
);

const Xiuxing = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const handleDev = () => showToast("正在开发中，敬请期待！");
  const [view, setView] = useState('main'); // 'main' or 'fiveTones'
  const [activeModal, setActiveModal] = useState(null); // 'twelve', 'ancient', 'sleep'

  const checkLogin = (action) => {
    if (user) {
      action();
    } else {
      showToast("请先登录以使用此功能");
      navigateTo('personal');
    }
  };

  if (view === 'fiveTones') {
      return <FiveTonesDetail onBack={() => setView('main')} />;
  }

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-8">
        <h2 className="text-3xl font-serif text-theme-primary mb-2">修行</h2>
        <p className="text-theme-secondary opacity-80">顺时养生，调理身心。</p>
      </header>
      
      {/* General Random Player */}
      <GeneralPlayerCard />

      {/* Five Tones Entry */}
      <FiveTonesEntryCard onClick={() => checkLogin(() => setView('fiveTones'))} />

      <div className="mt-8">
        <h3 className="text-lg font-serif text-theme-secondary mb-4 px-1 opacity-80">养生精选</h3>
        <SectionItem 
          icon={Clock} 
          title="十二时辰养生法" 
          desc="推送微训练、养生提醒和专属音效" 
          onClick={() => checkLogin(() => setActiveModal('twelve'))}
        />
        <SectionItem 
          icon={BookOpen} 
          title="古籍智慧导引" 
          desc="将古籍智慧转化为引导式冥想" 
          onClick={() => checkLogin(() => setActiveModal('ancient'))}
        />
        <SectionItem 
          icon={Moon} 
          title="安寝方" 
          desc="穴位按摩、药浴足疗、助眠导引" 
          onClick={() => checkLogin(() => setActiveModal('sleep'))}
        />
      </div>

      <TwelveHoursModal isOpen={activeModal === 'twelve'} onClose={() => setActiveModal(null)} />
      <AncientWisdomModal isOpen={activeModal === 'ancient'} onClose={() => setActiveModal(null)} />
      <SleepTherapyModal isOpen={activeModal === 'sleep'} onClose={() => setActiveModal(null)} />
    </div>
  );
};

export default Xiuxing;
