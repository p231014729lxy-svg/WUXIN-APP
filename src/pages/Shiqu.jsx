import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { useAudio } from '../context/AudioContext';
import { Award, ShoppingBag, Headphones, ChevronRight, X, Play, Pause, SkipBack, SkipForward, ChevronLeft, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import wechatImg from '../images/wechat.jpg';
import alipayImg from '../images/alipay.jpg';
import guchaImg from '../images/gucha.jpg';
import shenhaiImg from '../images/shenhai.jpg';
import kongshanImg from '../images/kongshan.jpg';
import yuyeImg from '../images/yuye.jpg';
import kongshanMusic from '../assets/audio/kongshan.mp3';

const MarketItem = ({ title, price, author, image, onClick }) => (
  <button onClick={onClick} className="bg-theme-surface border border-theme rounded-xl overflow-hidden text-left group shadow-sm flex flex-col h-full">
    <div className="aspect-square relative flex items-center justify-center overflow-hidden">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
      <Headphones size={32} className="text-white relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
      <div className="absolute top-2 right-2 bg-[var(--color-bg-primary)]/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs text-theme-primary font-medium z-10">
        {price}
      </div>
    </div>
    <div className="p-3 flex-1">
      <h4 className="text-theme-primary text-sm font-medium truncate">{title}</h4>
      <p className="text-xs text-theme-secondary opacity-60 truncate">{author}</p>
    </div>
  </button>
);

const PaymentModal = ({ item, onClose }) => {
  const [method, setMethod] = useState(null); // 'wechat' | 'alipay'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-theme-surface border border-theme rounded-3xl p-6 w-full max-w-sm relative shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-theme-secondary hover:text-theme-primary">
            <X size={24} />
        </button>
        
        <h3 className="text-xl font-serif text-theme-primary mb-2">解锁内容</h3>
        <p className="text-sm text-theme-secondary mb-6">该功能为付费项目，如有需要，请支付。</p>
        
        <div className="flex items-center gap-4 mb-6 bg-theme-primary/5 p-4 rounded-xl">
             <img src={item.image} alt={item.title} className="w-16 h-16 rounded-lg object-cover" />
             <div>
                 <h4 className="font-medium text-theme-primary">{item.title}</h4>
                 <p className="text-[var(--color-accent)] font-bold">{item.price}</p>
             </div>
        </div>

        {!method ? (
            <div className="space-y-3">
                <button 
                    onClick={() => setMethod('wechat')}
                    className="w-full py-3 bg-[#07C160] text-white rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                    微信支付
                </button>
                <button 
                    onClick={() => setMethod('alipay')}
                    className="w-full py-3 bg-[#1677FF] text-white rounded-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                    支付宝支付
                </button>
            </div>
        ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                <div className="w-48 h-48 bg-white p-2 rounded-xl mb-4 shadow-inner">
                    <img 
                        src={method === 'wechat' ? wechatImg : alipayImg} 
                        alt="QR Code" 
                        className="w-full h-full object-contain"
                    />
                </div>
                <p className="text-xs text-theme-secondary mb-4">请使用{method === 'wechat' ? '微信' : '支付宝'}扫码支付</p>
                <button 
                    onClick={() => setMethod(null)} 
                    className="text-theme-secondary text-sm hover:text-theme-primary underline"
                >
                    返回选择支付方式
                </button>
            </div>
        )}
      </motion.div>
    </div>
  );
};

const FullScreenPlayer = ({ onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);
    const { playExclusive, stopExclusive } = useAudio();
    const PLAYER_ID = 'kongshan-player';

    useEffect(() => {
        // Auto play
        if (audioRef.current) {
            playExclusive(PLAYER_ID);
            audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log("Autoplay blocked", e));
        }
        
        return () => {
            stopExclusive(PLAYER_ID);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
            stopExclusive(PLAYER_ID);
        } else {
            playExclusive(PLAYER_ID);
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(p || 0);
        }
    };

    return (
        <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 bottom-[90px] z-[30] bg-theme-surface flex flex-col"
        >
            <audio 
                ref={audioRef} 
                src={kongshanMusic} 
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
            />

            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <button onClick={onClose} className="p-2 rounded-full hover:bg-theme-primary/10 text-theme-primary">
                    <ChevronLeft size={28} />
                </button>
                <h3 className="text-theme-primary font-medium">正在播放</h3>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className={`w-64 h-64 rounded-full overflow-hidden shadow-2xl border-4 border-[var(--color-accent)]/20 mb-12 ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
                    <img src={kongshanImg} alt="Cover" className="w-full h-full object-cover" />
                </div>
                
                <h2 className="text-2xl font-serif text-theme-primary mb-2">空山新雨</h2>
                <p className="text-theme-secondary opacity-70 mb-12">Wuxin Official</p>

                {/* Progress */}
                <div className="w-full max-w-md mb-8">
                    <div className="h-1 bg-theme-primary/10 rounded-full overflow-hidden cursor-pointer">
                        <div 
                            className="h-full bg-[var(--color-accent)] transition-all duration-100" 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-10">
                    <button className="text-theme-secondary hover:text-theme-primary"><SkipBack size={32} /></button>
                    <button 
                        onClick={togglePlay}
                        className="w-20 h-20 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform active:scale-95"
                    >
                        {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>
                    <button className="text-theme-secondary hover:text-theme-primary"><SkipForward size={32} /></button>
                </div>
            </div>
        </motion.div>
    );
};

const Shiqu = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const handleDev = () => showToast("正在开发中，敬请期待！");
  
  const [paymentItem, setPaymentItem] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const items = [
      { id: 1, title: "雨夜听竹", price: "¥ 9.9", author: "听风者", image: yuyeImg, isFree: false },
      { id: 2, title: "空山新雨", price: "免费", author: "Wuxin Official", image: kongshanImg, isFree: true },
      { id: 3, title: "深海鲸鸣", price: "¥ 12", author: "OceanBlue", image: shenhaiImg, isFree: false },
      { id: 4, title: "古刹钟声", price: "¥ 6", author: "ZenMaster", image: guchaImg, isFree: false },
  ];

  const handleItemClick = (item) => {
      if (!user) {
          showToast("请先登录以使用此功能");
          navigateTo('personal');
          return;
      }
      if (item.isFree) {
          setShowPlayer(true);
      } else {
          setPaymentItem(item);
      }
  };

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-8">
        <h2 className="text-3xl font-serif text-theme-primary mb-2">拾趣</h2>
        <p className="text-theme-secondary opacity-80">修仙进阶，妙趣横生。</p>
      </header>

      {/* Level System Card */}
      <button onClick={handleDev} className="w-full bg-gradient-to-r from-[var(--color-accent)] to-theme-primary border border-theme rounded-2xl p-6 mb-8 relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-[var(--color-bg-primary)]">
          <Award size={80} />
        </div>
        <div className="relative z-10 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[var(--color-bg-primary)] text-xs font-bold border border-[var(--color-bg-primary)]/50 px-2 py-0.5 rounded">当前境界</span>
            <span className="text-[var(--color-bg-primary)] opacity-80 text-xs">筑基期 · 前期</span>
          </div>
          <h3 className="text-2xl font-serif text-[var(--color-bg-primary)] mb-4">距下一境界还需 300 灵力</h3>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <div className="w-2/3 h-full bg-[var(--color-bg-primary)] rounded-full" />
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--color-bg-primary)] opacity-80 mt-2">
            查看权益 <ChevronRight size={12} />
          </div>
        </div>
      </button>

      {/* Sound Market */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif text-theme-primary flex items-center gap-2">
            <ShoppingBag size={18} className="text-theme-secondary" /> 声创市集
          </h3>
          <button onClick={handleDev} className="text-xs text-theme-secondary hover:text-theme-primary transition-colors">查看全部</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {items.map(item => (
                <MarketItem 
                    key={item.id} 
                    title={item.title} 
                    price={item.price} 
                    author={item.author} 
                    image={item.image}
                    onClick={() => handleItemClick(item)} 
                />
            ))}
        </div>
      </div>

      {/* Fantasy Stories */}
      <div>
        <h3 className="text-lg font-serif text-theme-primary mb-4">神游太虚</h3>
        <button onClick={handleDev} className="w-full h-32 bg-theme-surface border border-theme rounded-2xl flex items-center justify-center relative overflow-hidden group shadow-sm">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          <div className="text-center z-10">
            <h4 className="text-xl font-serif text-theme-primary mb-1 group-hover:text-[var(--color-accent)] transition-colors">赛博仙境指南</h4>
            <p className="text-xs text-theme-secondary opacity-60">点击开启幻想之旅</p>
          </div>
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
          {paymentItem && (
              <PaymentModal item={paymentItem} onClose={() => setPaymentItem(null)} />
          )}
          {showPlayer && (
              <FullScreenPlayer onClose={() => setShowPlayer(false)} />
          )}
      </AnimatePresence>
    </div>
  );
};

export default Shiqu;
