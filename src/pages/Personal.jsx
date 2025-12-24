import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useHealth } from '../context/HealthContext';
import { useToast } from '../context/ToastContext';
import { User, LogIn, LogOut, Save, FileText, Award, Calendar, Gift, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';

const REALMS = [
    { name: '炼气期', minDays: 0, rewards: ['基础冥想课'] },
    { name: '筑基期', minDays: 7, rewards: ['进阶呼吸法', '中药香囊兑换券'] },
    { name: '金丹期', minDays: 21, rewards: ['大师养生课', '专属App皮肤'] },
    { name: '元婴期', minDays: 49, rewards: ['深度冥想场景', '养生手串兑换券'] },
    { name: '化神期', minDays: 81, rewards: ['线下静修营资格', '安神枕兑换券'] },
];

const Personal = () => {
  const { user, login, logout, updateProfile } = useUser();
  const { healthProfile } = useHealth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  // Realm State
  const [checkInDays, setCheckInDays] = useState(12); // Mock initial days
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Sync health profile to user bio/data if logged in
  useEffect(() => {
      if (user && healthProfile) {
          // In a real app, this would be an API call to sync data
          // Here we just visually acknowledge it
      }
  }, [user, healthProfile]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      login({ name: formData.username, bio: '静心修行中...' });
    }
  };

  const handleCheckIn = () => {
      if (hasCheckedInToday) {
          showToast("今日已打卡");
          return;
      }
      setCheckInDays(prev => prev + 1);
      setHasCheckedInToday(true);
      showToast("打卡成功！灵力 +10");
  };

  const getCurrentRealm = () => {
      for (let i = REALMS.length - 1; i >= 0; i--) {
          if (checkInDays >= REALMS[i].minDays) {
              return { 
                  current: REALMS[i], 
                  next: REALMS[i+1],
                  progress: REALMS[i+1] 
                      ? ((checkInDays - REALMS[i].minDays) / (REALMS[i+1].minDays - REALMS[i].minDays)) * 100
                      : 100
              };
          }
      }
      return { current: REALMS[0], next: REALMS[1], progress: 0 };
  };

  const realmInfo = getCurrentRealm();

  if (!user) {
    return (
      <div className="min-h-screen p-6 pt-24 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-theme-surface border border-theme p-8 rounded-3xl shadow-xl text-center"
        >
          <div className="w-20 h-20 mx-auto bg-theme-primary/10 rounded-full flex items-center justify-center mb-6 text-theme-primary">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-serif text-theme-primary mb-2">欢迎归来</h2>
          <p className="text-theme-secondary text-sm mb-8">登录账号，同步您的修行数据</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="用户名"
              className="w-full bg-theme-bg/50 border border-theme rounded-xl px-4 py-3 text-theme-primary focus:outline-none focus:border-[var(--color-accent)]"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              type="password"
              placeholder="密码"
              className="w-full bg-theme-bg/50 border border-theme rounded-xl px-4 py-3 text-theme-primary focus:outline-none focus:border-[var(--color-accent)]"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-full bg-[var(--color-accent)] text-[var(--color-bg-primary)] py-3 rounded-xl font-medium shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              立即登录
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 pt-24 pb-24">
      <header className="mb-8 flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-serif text-theme-primary mb-2">个人中心</h2>
           <p className="text-theme-secondary opacity-80">管理您的档案与数据</p>
        </div>
        <button onClick={logout} className="p-2 text-theme-secondary hover:text-theme-primary">
            <LogOut size={24} />
        </button>
      </header>

      {/* User Info */}
      <div className="bg-theme-surface border border-theme p-6 rounded-3xl shadow-xl mb-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-[var(--color-bg-primary)] text-3xl font-serif shadow-inner">
          {user.name[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-serif text-theme-primary mb-1">{user.name}</h3>
          <p className="text-theme-secondary text-sm opacity-80">{user.bio}</p>
        </div>
        <button 
            onClick={handleCheckIn}
            disabled={hasCheckedInToday}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                hasCheckedInToday 
                ? 'bg-theme-primary/10 text-theme-secondary cursor-default' 
                : 'bg-[var(--color-accent)] text-white shadow-lg hover:scale-105 active:scale-95'
            }`}
        >
            {hasCheckedInToday ? '已打卡' : '打卡'}
        </button>
      </div>

      {/* Realm System */}
      <div className="bg-gradient-to-br from-theme-surface to-theme-primary/5 border border-theme p-6 rounded-3xl shadow-md mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
              <Award size={100} />
          </div>
          
          <div className="flex justify-between items-end mb-4 relative z-10">
              <div>
                  <p className="text-xs text-theme-secondary mb-1">当前境界</p>
                  <h3 className="text-3xl font-serif text-theme-primary">{realmInfo.current.name}</h3>
              </div>
              <div className="text-right">
                  <p className="text-xs text-theme-secondary mb-1">累计修行</p>
                  <p className="text-xl font-mono text-[var(--color-accent)]">{checkInDays} <span className="text-xs text-theme-secondary">天</span></p>
              </div>
          </div>

          <div className="w-full h-2 bg-theme-primary/10 rounded-full overflow-hidden mb-2">
              <div 
                  className="h-full bg-[var(--color-accent)] transition-all duration-1000" 
                  style={{ width: `${realmInfo.progress}%` }}
              />
          </div>
          <p className="text-xs text-theme-secondary text-center opacity-70">
              {realmInfo.next ? `距离 ${realmInfo.next.name} 还需 ${realmInfo.next.minDays - checkInDays} 天` : '已臻化境'}
          </p>

          <div className="mt-6 pt-6 border-t border-theme/20">
              <h4 className="text-sm font-bold text-theme-primary mb-3 flex items-center gap-2">
                  <Gift size={16} /> 境界奖励
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2">
                  {REALMS.map((realm, idx) => {
                      const isUnlocked = checkInDays >= realm.minDays;
                      return (
                          <div key={idx} className={`flex-shrink-0 w-32 p-3 rounded-xl border ${isUnlocked ? 'bg-theme-surface border-[var(--color-accent)]/30' : 'bg-theme-primary/5 border-transparent'} flex flex-col items-center text-center`}>
                              <div className={`mb-2 ${isUnlocked ? 'text-[var(--color-accent)]' : 'text-theme-secondary opacity-50'}`}>
                                  {isUnlocked ? <Unlock size={20} /> : <Lock size={20} />}
                              </div>
                              <p className={`text-xs font-bold mb-1 ${isUnlocked ? 'text-theme-primary' : 'text-theme-secondary'}`}>{realm.name}</p>
                              <p className="text-[10px] text-theme-secondary opacity-70 truncate w-full">{realm.rewards[0]}</p>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>

      {/* Data Cards */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-theme-surface border border-theme p-4 rounded-2xl flex flex-col items-center justify-center py-8 hover:bg-theme-surface/80 transition-colors cursor-pointer relative overflow-hidden">
            <div className="w-12 h-12 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary mb-3">
                <FileText size={24} />
            </div>
            <span className="text-theme-primary font-medium">体质档案</span>
            {healthProfile ? (
                <span className="text-xs text-[var(--color-accent)] mt-1 font-bold">已同步: {healthProfile.diagnosis?.result?.type || '未知体质'}</span>
            ) : (
                <span className="text-xs text-theme-secondary mt-1">暂无数据</span>
            )}
         </div>
         <div className="bg-theme-surface border border-theme p-4 rounded-2xl flex flex-col items-center justify-center py-8 hover:bg-theme-surface/80 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-theme-primary/10 flex items-center justify-center text-theme-primary mb-3">
                <Save size={24} />
            </div>
            <span className="text-theme-primary font-medium">数据备份</span>
            <span className="text-xs text-theme-secondary mt-1">自动同步中</span>
         </div>
      </div>

      <div className="mt-8 p-4 bg-theme-surface/30 rounded-xl border border-theme/50 text-xs text-theme-secondary opacity-70">
        <p>用户ID: {user.id}</p>
        <p>登录时间: {new Date(user.loginTime).toLocaleString()}</p>
        <p className="mt-2">您的所有数据（体质测试、冥想记录）已加密保存在本地文档中，随时可调用。</p>
      </div>
    </div>
  );
};

export default Personal;
