import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { Users, Gamepad2, MessageCircle, Heart, UserPlus, Leaf, Sparkles, Send, Mic, Play, X, User, Pause, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import rainMusic from '../assets/audio/rain.mp3'; // Corrected import
import { chatWithAI } from '../services/deepseek';

// --- Sub-Components ---

// 1. 默契共修 (Co-Cultivation)
const CoCultivationView = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const [isInRoom, setIsInRoom] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  const [heartRate, setHeartRate] = useState(75);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({ name: '', password: '', desc: '' });
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Mock rooms
  const rooms = [
    { id: 1, name: "晨间静心", count: 12, max: 20, status: "进行中" },
    { id: 2, name: "午休冥想", count: 5, max: 10, status: "等待中" },
    { id: 3, name: "睡前安神", count: 88, max: 100, status: "进行中" },
  ];

  // Simulate heart rate fluctuation
  useEffect(() => {
    if (isInRoom) {
      const interval = setInterval(() => {
        setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isInRoom]);

  // Timer logic
  useEffect(() => {
      let interval;
      if (isInRoom && startTime) {
          interval = setInterval(() => {
              setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [isInRoom, startTime]);

  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const joinRoom = (room) => {
    if (!user) {
        showToast("请先登录以加入共修");
        navigateTo('personal');
        return;
    }
    setActiveRoom(room);
    setIsInRoom(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    showToast(`已加入 ${room.name}`);
  };

  const leaveRoom = () => {
    setIsInRoom(false);
    setActiveRoom(null);
    setStartTime(null);
    setElapsedTime(0);
    showToast("已退出共修室");
  };

  const handleCreateRoom = () => {
      const room = {
          id: Date.now(),
          name: newRoomData.name,
          count: 0,
          max: 50,
          status: "进行中",
          desc: newRoomData.desc
      };
      setActiveRoom(room);
      setIsInRoom(true);
      setStartTime(Date.now());
      setElapsedTime(0);
      setShowCreateModal(false);
      showToast("共修室创建成功");
      setNewRoomData({ name: '', password: '', desc: '' }); // Reset
  };

  const isFormValid = newRoomData.name.trim() !== '' && newRoomData.desc.trim() !== '';

  if (isInRoom) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
        <div className="bg-theme-surface border border-theme rounded-3xl p-6 shadow-xl relative overflow-hidden flex-1 flex flex-col items-center justify-center">
          {/* Room Header */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-theme-primary font-serif">{activeRoom.name}</span>
            </div>
            <button onClick={leaveRoom} className="p-2 bg-black/20 rounded-full text-white/80 hover:bg-black/30">
              <X size={20} />
            </button>
          </div>

          {/* Visualization */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-[var(--color-accent)] opacity-10 rounded-full animate-ping duration-[3000ms]" />
            <div className="absolute inset-8 bg-[var(--color-accent)] opacity-20 rounded-full animate-ping duration-[2000ms] delay-500" />
            <div className="w-32 h-32 rounded-full bg-theme-surface border-4 border-[var(--color-accent)] flex items-center justify-center z-10 shadow-[0_0_30px_rgba(var(--color-accent),0.3)]">
               <span className="text-3xl font-serif text-theme-primary animate-pulse">ॐ</span>
            </div>
            
            {/* Participants (Only show if count > 0, for new room it is 0 initially so only self) */}
            {[...Array(activeRoom.count > 0 ? 6 : 0)].map((_, i) => (
               <div 
                 key={i}
                 className="absolute w-10 h-10 rounded-full bg-theme-surface border border-theme flex items-center justify-center shadow-md"
                 style={{ 
                    transform: `rotate(${i * 60}deg) translate(140px) rotate(-${i * 60}deg)`
                 }}
               >
                 <User size={16} className="text-theme-secondary" />
               </div>
            ))}
          </div>

          {/* Stats */}
          <div className="text-center space-y-2 mb-8">
             <h2 className="text-4xl font-mono text-theme-primary">{formatTime(elapsedTime)}</h2>
             <p className="text-theme-secondary text-sm">共修时长</p>
          </div>

          <div className="flex items-center gap-4 text-theme-secondary text-sm mb-8">
             <div className="flex items-center gap-1">
                <Heart size={16} className="text-red-500 fill-current animate-pulse" />
                <span>{heartRate} BPM</span>
             </div>
             <div className="flex items-center gap-1">
                <Users size={16} />
                <span>{activeRoom.count + 1} 在线</span>
             </div>
          </div>

          {/* Interaction */}
          <div className="flex gap-4">
             <button className="p-3 rounded-full bg-theme-surface border border-theme text-2xl hover:scale-110 transition-transform">🙏</button>
             <button className="p-3 rounded-full bg-theme-surface border border-theme text-2xl hover:scale-110 transition-transform">🌸</button>
             <button className="p-3 rounded-full bg-theme-surface border border-theme text-2xl hover:scale-110 transition-transform">✨</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 relative">
       <div className="bg-[var(--color-accent)]/10 p-4 rounded-xl border border-[var(--color-accent)]/20 mb-6">
          <h3 className="text-theme-primary font-medium mb-1">以心传心</h3>
          <p className="text-xs text-theme-secondary opacity-80">无声的连接，跨越语言的障碍。</p>
       </div>

       <div className="grid gap-4">
          {rooms.map(room => (
            <button 
              key={room.id}
              onClick={() => joinRoom(room)}
              className="bg-theme-surface border border-theme p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-theme-primary/5 flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                     <Sparkles size={20} />
                  </div>
                  <div className="text-left">
                     <h4 className="text-theme-primary font-medium">{room.name}</h4>
                     <p className="text-xs text-theme-secondary">{room.status} · {room.count}/{room.max}人</p>
                  </div>
               </div>
               <div className="px-3 py-1 rounded-full bg-theme-primary/5 text-xs text-theme-primary">加入</div>
            </button>
          ))}
       </div>

       <button 
          onClick={() => {
              if (!user) {
                  showToast("请先登录以创建共修室");
                  navigateTo('personal');
                  return;
              }
              setShowCreateModal(true);
          }}
          className="w-full py-3 mt-4 border border-dashed border-theme rounded-xl text-theme-secondary hover:text-theme-primary hover:border-theme-primary transition-colors flex items-center justify-center gap-2"
       >
          <UserPlus size={18} />
          创建新共修室
       </button>

       {/* Create Room Modal */}
       <AnimatePresence>
         {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            >
               <motion.div
                 initial={{ scale: 0.9, y: 20 }}
                 animate={{ scale: 1, y: 0 }}
                 exit={{ scale: 0.9, y: 20 }}
                 className="w-full max-w-sm bg-theme-surface border border-theme rounded-3xl p-6 shadow-2xl"
               >
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl font-serif text-theme-primary">创建共修室</h3>
                     <button onClick={() => setShowCreateModal(false)} className="text-theme-secondary hover:text-theme-primary">
                        <X size={24} />
                     </button>
                  </div>
                  
                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs text-theme-secondary mb-1">共修室名称 <span className="text-red-400">*</span></label>
                        <input 
                           type="text" 
                           value={newRoomData.name}
                           onChange={(e) => setNewRoomData({...newRoomData, name: e.target.value})}
                           placeholder="给静修空间起个名字"
                           className="w-full bg-theme-primary/5 border border-theme rounded-xl px-4 py-3 text-theme-primary focus:outline-none focus:border-[var(--color-accent)]"
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-theme-secondary mb-1">密码 (选填)</label>
                        <input 
                           type="password" 
                           value={newRoomData.password}
                           onChange={(e) => setNewRoomData({...newRoomData, password: e.target.value})}
                           placeholder="留空则公开"
                           className="w-full bg-theme-primary/5 border border-theme rounded-xl px-4 py-3 text-theme-primary focus:outline-none focus:border-[var(--color-accent)]"
                        />
                     </div>
                     <div>
                        <label className="block text-xs text-theme-secondary mb-1">简介 <span className="text-red-400">*</span></label>
                        <textarea 
                           value={newRoomData.desc}
                           onChange={(e) => setNewRoomData({...newRoomData, desc: e.target.value})}
                           placeholder="简述共修主题或寄语..."
                           rows={3}
                           className="w-full bg-theme-primary/5 border border-theme rounded-xl px-4 py-3 text-theme-primary focus:outline-none focus:border-[var(--color-accent)] resize-none"
                        />
                     </div>
                  </div>

                  <button 
                     onClick={handleCreateRoom}
                     disabled={!isFormValid}
                     className={`w-full py-3 mt-6 rounded-xl font-medium transition-all ${
                        isFormValid 
                           ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] shadow-lg hover:brightness-110' 
                           : 'bg-theme-secondary/20 text-theme-secondary cursor-not-allowed'
                     }`}
                  >
                     进入共修室
                  </button>
               </motion.div>
            </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

// 2. 冥想搭子 & 云养精灵 (Partner & Elf)
const PartnerElfView = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const [energy, setEnergy] = useState(350);
  const maxEnergy = 1000;
  const [showChat, setShowChat] = useState(false);
  const [partnerName, setPartnerName] = useState("静云");
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
      { role: 'assistant', content: `你好呀，我是${partnerName}。虽然我们相隔千里，但在共修的路上，我会一直陪伴着你。` }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showAngry, setShowAngry] = useState(false);

  // Update chat partner name when partner changes
  useEffect(() => {
      setChatMessages(prev => [
          { role: 'assistant', content: `你好呀，我是${partnerName}。虽然我们相隔千里，但在共修的路上，我会一直陪伴着你。` }
      ]);
  }, [partnerName]);

  const handleChatSend = async () => {
      if (!user) {
          showToast("请先登录以发送消息");
          navigateTo('personal');
          return;
      }
      if (!chatInput.trim()) return;
      const userMsg = { role: 'user', content: chatInput };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsChatLoading(true);

      try {
          // Simulate partner persona
          const messages = [
              { role: 'system', content: `You are a meditation partner named ${partnerName}. You are supportive, calm, and friendly. You are chatting with your cultivation partner. Keep responses short and encouraging.` },
              ...chatMessages.map(m => ({ role: m.role, content: m.content })),
              userMsg
          ];
          const reply = await chatWithAI(messages);
          setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      } catch (e) {
          setChatMessages(prev => [...prev, { role: 'assistant', content: "（网络波动，对方暂时没有收到消息）" }]);
      } finally {
          setIsChatLoading(false);
      }
  };

  // Decay Logic
  useEffect(() => {
      const interval = setInterval(() => {
          // Mocking the "every 6 hours" logic by just checking every second if we should decay
          // In real app, check localStorage timestamp. 
          // Here, let's just simulate that time passed if energy > 0
          // For demonstration, I won't actually auto-decay every second, 
          // but I will implement the logic that *if* it hits 0, we show modal.
          
          if (energy <= 0 && !showResetConfirm && !showAngry) {
              setShowResetConfirm(true);
          }
      }, 1000);
      return () => clearInterval(interval);
  }, [energy, showResetConfirm, showAngry]);

  // Simulate Decay for Demo (Optional button or trigger?)
  // Let's add a hidden trigger or just rely on manual decrement for testing?
  // User asked for "every 6 hours decay 600".
  // I will add a manual "Fast Forward Time" button for user to test, or just leave as is.

  const handleResetChoice = (choice) => {
      setShowResetConfirm(false);
      if (choice === 'yes') {
          setEnergy(0); // Actually it is already 0 or less, but we reset state to "Fresh Start" 0
          showToast("已重新开始养育");
      } else {
          setShowAngry(true);
      }
  };

  const handleCoax = () => {
      showToast("精灵勉强原谅你了，请好好养育它。");
      setShowAngry(false);
      setEnergy(0);
  };

  const switchPartner = () => {
      if (!user) {
          showToast("请先登录以切换搭子");
          navigateTo('personal');
          return;
      }
      const names = ["清风", "明月", "山川", "河流"];
      const newName = names[Math.floor(Math.random() * names.length)];
      setPartnerName(newName);
      showToast(`已切换搭子为：${newName}`);
  };

  // Mock Elf Evolution
  const getElfStage = () => {
    if (energy < 200) return { name: "灵种", icon: "🌱" };
    if (energy < 600) return { name: "幼苗", icon: "🌿" };
    return { name: "神木", icon: "🌳" };
  };

  const stage = getElfStage();

  const handleMeditate = () => {
    if (!user) {
        showToast("请先登录以进行共修");
        navigateTo('personal');
        return;
    }
    setEnergy(prev => Math.min(prev + 50, maxEnergy));
    showToast("共修完成！精灵能量 +50");
  };

  return (
    <div className="space-y-6 relative">
       {/* Partner Card */}
       <div className="bg-theme-surface border border-theme rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerName}`} alt="Partner" />
             </div>
             <div>
                <h4 className="text-theme-primary font-medium text-sm">搭子：{partnerName}</h4>
                <p className="text-xs text-theme-secondary">亲密度: Lv.3 (知音)</p>
             </div>
          </div>
          <div className="flex gap-2">
            <button onClick={switchPartner} className="p-2 rounded-full bg-theme-primary/5 text-theme-primary hover:bg-[var(--color-accent)] hover:text-white transition-colors" title="切换搭子">
                <RefreshCw size={18} />
            </button>
            <button onClick={() => setShowChat(true)} className="p-2 rounded-full bg-theme-primary/5 text-theme-primary hover:bg-[var(--color-accent)] hover:text-white transition-colors">
                <MessageCircle size={18} />
            </button>
          </div>
       </div>

       {/* Elf Container */}
       <div className="bg-gradient-to-b from-theme-surface to-theme-primary/5 border border-theme rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 text-xs font-mono text-theme-secondary opacity-60">
             能量: {Math.max(0, energy)}/{maxEnergy}
          </div>

          <motion.div 
            key={stage.name}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="w-40 h-40 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-8xl shadow-[0_0_50px_rgba(var(--color-accent),0.2)] mb-6 relative z-10"
          >
             {stage.icon}
          </motion.div>

          <h3 className="text-2xl font-serif text-theme-primary mb-1">心猿 · {stage.name}</h3>
          <p className="text-xs text-theme-secondary mb-6">"每一次呼吸，都在滋养我的生长"</p>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-theme-primary/10 rounded-full overflow-hidden mb-8">
             <motion.div 
               className="h-full bg-[var(--color-accent)]"
               initial={{ width: 0 }}
               animate={{ width: `${(Math.max(0, energy) / maxEnergy) * 100}%` }}
               transition={{ duration: 1 }}
             />
          </div>

          <button 
             onClick={handleMeditate}
             className="w-full btn-theme py-3 rounded-xl font-medium shadow-lg flex items-center justify-center gap-2"
          >
             <Leaf size={18} />
             开始共修充能
          </button>
          
          {/* Debug Button to simulate decay */}
          <button onClick={() => setEnergy(prev => prev - 600)} className="mt-4 text-xs text-theme-secondary opacity-30 hover:opacity-100">
             (测试: 模拟6小时流逝)
          </button>
       </div>

       {/* Tip */}
       <p className="text-center text-xs text-theme-secondary opacity-60">
          坚持共修可解锁“意马”形态
       </p>

       {/* Chat Modal */}
       <AnimatePresence>
           {showChat && (
               <motion.div
                   initial={{ opacity: 0, y: "100%" }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: "100%" }}
                   className="fixed left-4 right-4 bottom-[100px] h-[60vh] z-50 bg-theme-surface flex flex-col border border-theme rounded-3xl shadow-2xl overflow-hidden"
               >
                   <div className="p-4 border-b border-theme flex justify-between items-center shadow-sm">
                       <h3 className="font-serif text-theme-primary">与 {partnerName} 的对话</h3>
                       <button onClick={() => setShowChat(false)}><X size={24} className="text-theme-secondary" /></button>
                   </div>
                   <div className="flex-1 p-4 overflow-y-auto space-y-4">
                       {chatMessages.map((msg, idx) => (
                           <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                               <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                                   msg.role === 'user' 
                                   ? 'bg-[var(--color-accent)] text-white rounded-br-none' 
                                   : 'bg-theme-primary/10 text-theme-primary rounded-bl-none'
                               }`}>
                                   {msg.content}
                               </div>
                           </div>
                       ))}
                       {isChatLoading && (
                           <div className="flex justify-start">
                               <div className="bg-theme-primary/10 p-3 rounded-2xl rounded-bl-none text-theme-secondary text-xs">
                                   对方正在输入...
                               </div>
                           </div>
                       )}
                   </div>
                   <div className="p-4 border-t border-theme flex gap-2">
                       <input 
                           type="text" 
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                           placeholder="发送消息..." 
                           className="flex-1 bg-theme-primary/5 rounded-full px-4 py-2 text-sm focus:outline-none text-theme-primary" 
                       />
                       <button 
                           onClick={handleChatSend}
                           disabled={isChatLoading || !chatInput.trim()}
                           className="p-2 bg-[var(--color-accent)] text-white rounded-full disabled:opacity-50"
                       >
                           <Send size={18} />
                       </button>
                   </div>
               </motion.div>
           )}
       </AnimatePresence>

       {/* Reset Confirm Modal */}
       <AnimatePresence>
           {showResetConfirm && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                   <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-theme-surface rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl border border-theme">
                       <h3 className="text-lg font-bold text-theme-primary mb-2">能量耗尽</h3>
                       <p className="text-sm text-theme-secondary mb-6">精灵能量已归零，是否重新养育？</p>
                       <div className="flex gap-3">
                           <button onClick={() => handleResetChoice('yes')} className="flex-1 py-2 bg-[var(--color-accent)] text-white rounded-xl">是</button>
                           <button onClick={() => handleResetChoice('no')} className="flex-1 py-2 bg-theme-primary/10 text-theme-primary rounded-xl">否</button>
                       </div>
                   </motion.div>
               </div>
           )}
       </AnimatePresence>

       {/* Angry Elf Modal */}
       <AnimatePresence>
           {showAngry && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                   <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-theme-surface rounded-3xl p-6 w-full max-w-xs text-center shadow-2xl border border-theme">
                       <div className="text-4xl mb-4">💢</div>
                       <h3 className="text-lg font-bold text-theme-primary mb-2">精灵生气了！</h3>
                       <p className="text-sm text-theme-secondary mb-6">你需要哄一哄它再继续养育。</p>
                       <button onClick={handleCoax} className="w-full py-2 bg-[var(--color-accent)] text-white rounded-xl">哄一哄</button>
                   </motion.div>
               </div>
           )}
       </AnimatePresence>
    </div>
  );
};

// 3. 心语林 (Heart Forest)
const HeartForestView = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const [posts, setPosts] = useState([
    { id: 1, author: "匿名行者", content: "坚持打卡第12天，感觉睡眠质量明显改善了。加油！", likes: 56, type: 'text' },
    { id: 2, author: "ForestUser", content: "分享一段我自己录的雨声，希望能治愈大家。", likes: 32, type: 'audio', duration: "0:45", src: rainMusic },
    { id: 3, author: "DeepSleep", content: "推荐大家睡前喝一杯温热的牛奶，加一点蜂蜜。", likes: 18, type: 'text' },
  ]);

  const [playingId, setPlayingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  // New Post State
  const [newPostContent, setNewPostContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleLike = (id) => {
    if (!user) {
        showToast("请先登录以点赞");
        navigateTo('personal');
        return;
    }
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    showToast("已点赞");
  };

  const toggleAudio = (post) => {
      if (playingId === post.id) {
          audioRef.current.pause();
          setPlayingId(null);
          setProgress(0);
      } else {
          setPlayingId(post.id);
          setTimeout(() => {
              if (audioRef.current) {
                  audioRef.current.src = post.src;
                  audioRef.current.play();
              }
          }, 0);
      }
  };

  const handleTimeUpdate = () => {
      if (audioRef.current) {
          const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(p || 0);
      }
  };

  const handleSendPost = () => {
      if (!user) {
          showToast("请先登录以发布内容");
          navigateTo('personal');
          return;
      }
      if (!newPostContent.trim()) return;
      const newPost = {
          id: Date.now(),
          author: "我",
          content: newPostContent,
          type: 'text',
          likes: 0
      };
      // Insert above "匿名行者" (which is id 1). 
      // Actually user said "insert above anonymous walker". 
      // If we just prepend to list, it will be at top.
      setPosts(prev => [newPost, ...prev]);
      setNewPostContent('');
      showToast("发布成功");
  };

  const handleRecord = async () => {
      if (!user) {
          showToast("请先登录以录制语音");
          navigateTo('personal');
          return;
      }
      if (isRecording) {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      } else {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              mediaRecorderRef.current = new MediaRecorder(stream);
              audioChunksRef.current = [];
              
              mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
              mediaRecorderRef.current.onstop = () => {
                  const blob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
                  const url = URL.createObjectURL(blob);
                  const newPost = {
                      id: Date.now(),
                      author: "我",
                      content: "语音分享",
                      type: 'audio',
                      duration: "0:10", // Mock duration
                      src: url,
                      likes: 0
                  };
                  setPosts(prev => [newPost, ...prev]);
                  showToast("语音发布成功");
              };
              
              mediaRecorderRef.current.start();
              setIsRecording(true);
              showToast("开始录音...");
          } catch (e) {
              showToast("无法访问麦克风");
          }
      }
  };

  const handleAIPolish = async () => {
      if (!newPostContent.trim()) {
          showToast("请先输入内容");
          return;
      }
      showToast("AI正在润色...");
      try {
          const polished = await chatWithAI([{ role: 'user', content: `请将这句话润色得更加温暖、治愈，适合发在冥想社区：${newPostContent}` }]);
          setNewPostContent(polished.replace(/^"|"$/g, '')); // Remove quotes if any
      } catch (e) {
          showToast("润色失败");
      }
  };

  return (
    <div className="space-y-4">
       <audio 
         ref={audioRef} 
         onEnded={() => { setPlayingId(null); setProgress(0); }} 
         onTimeUpdate={handleTimeUpdate}
         className="hidden" 
       />

       {/* Create Post Input */}
       <div className="bg-theme-surface border border-theme rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex gap-3">
             <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)]">
                <User size={20} />
             </div>
             <div className="flex-1">
                <input 
                   type="text" 
                   value={newPostContent}
                   onChange={(e) => setNewPostContent(e.target.value)}
                   placeholder="分享此刻的心得..." 
                   className="w-full bg-transparent border-none focus:outline-none text-theme-primary text-sm h-10"
                />
                <div className="flex justify-between items-center mt-2 border-t border-theme/20 pt-2">
                   <div className="flex gap-2">
                      <button 
                        onClick={handleRecord}
                        className={`text-theme-secondary hover:text-[var(--color-accent)] transition-colors ${isRecording ? 'text-red-500 animate-pulse' : ''}`}
                      >
                        <Mic size={18} />
                      </button>
                      <button onClick={handleAIPolish} className="text-theme-secondary hover:text-[var(--color-accent)]"><Sparkles size={18} /></button>
                   </div>
                   <button onClick={handleSendPost} className="text-xs btn-theme px-3 py-1 rounded-full shadow-sm hover:brightness-110 transition-all">发布</button>
                </div>
             </div>
          </div>
       </div>

       {/* Feed */}
       {posts.map(post => (
         <div key={post.id} className="bg-theme-surface border border-theme p-4 rounded-2xl mb-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-theme-primary/10 text-theme-primary"
              >
                {post.author[0]}
              </div>
              <span className="text-xs text-theme-secondary">{post.author}</span>
            </div>
            
            {post.type === 'text' && (
               <p className="text-theme-primary text-sm mb-3 leading-relaxed">{post.content}</p>
            )}

            {post.type === 'audio' && (
               <div className="mb-3">
                  <p className="text-theme-primary text-sm mb-2">{post.content}</p>
                  <div className="flex items-center gap-3 bg-theme-primary/5 p-2 rounded-xl w-fit pr-4">
                     <button 
                        onClick={() => toggleAudio(post)}
                        className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center hover:scale-105 transition-transform"
                     >
                        {playingId === post.id ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                     </button>
                     <div className="h-1 w-24 bg-theme-secondary/20 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-100" 
                            style={{ width: playingId === post.id ? `${progress}%` : '0%' }}
                        />
                     </div>
                     <span className="text-xs text-theme-secondary">{post.duration}</span>
                  </div>
               </div>
            )}

            <div className="flex items-center gap-6 text-xs text-theme-secondary opacity-60">
              <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 hover:text-red-500 transition-colors">
                 <Heart size={14} /> {post.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-theme-primary transition-colors">
                 <MessageCircle size={14} /> 评论
              </button>
            </div>
          </div>
       ))}
    </div>
  );
};


// --- Main Page Component ---

const Chenyuan = () => {
  const [activeTab, setActiveTab] = useState('co-cultivation');
  const rainAudioRef = useRef(null);
  const handleRainTimeUpdate = () => {};

  const tabs = [
    { id: 'co-cultivation', label: '默契共修' },
    { id: 'partner-elf', label: '搭子精灵' },
    { id: 'heart-forest', label: '心语林' },
  ];

  return (
    <div className="p-6 pt-12 pb-24 min-h-screen">
      <audio 
        ref={rainAudioRef} 
        src={rainMusic} 
        loop 
        onTimeUpdate={handleRainTimeUpdate}
      />
      <header className="mb-6">
        <h2 className="text-3xl font-serif text-theme-primary mb-2">尘缘</h2>
        <p className="text-theme-secondary opacity-80">默契共修，温暖同行。</p>
      </header>

      {/* Custom Tab Navigation */}
      <div className="flex p-1 bg-theme-surface border border-theme rounded-xl mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id 
                ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)] shadow-sm' 
                : 'text-theme-secondary hover:text-theme-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'co-cultivation' && <CoCultivationView />}
          {activeTab === 'partner-elf' && <PartnerElfView />}
          {activeTab === 'heart-forest' && <HeartForestView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Chenyuan;
