import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useChat } from '../context/ChatContext';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { Home, Activity, Wifi, Sparkles } from 'lucide-react';
import SmartLinkageModal from '../components/SmartLinkageModal';

const StatusCard = ({ icon: Icon, title, status, desc, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full p-5 rounded-2xl border transition-all mb-4 text-left relative overflow-hidden shadow-sm ${
      active 
        ? 'bg-theme-surface border-theme shadow-[0_0_20px_rgba(var(--color-accent),0.1)]' 
        : 'bg-theme-surface border-theme hover:bg-theme-surface/80'
    }`}
  >
    {active && (
      <div className="absolute top-0 right-0 p-2">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent)] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--color-accent)]"></span>
        </span>
      </div>
    )}
    
    <div 
        className={`p-3 rounded-full w-fit mb-3 transition-colors`}
        style={{ backgroundColor: 'var(--color-card-icon-bg)', color: 'var(--color-card-icon-fg)' }}
    >
      <Icon size={24} />
    </div>
    
    <h3 className="text-lg font-medium text-theme-primary mb-1">{title}</h3>
    <div className="flex items-center gap-2 mb-2">
      <span className={`text-xs px-2 py-0.5 rounded-full border border-theme text-theme-secondary opacity-80`}>
        {status}
      </span>
    </div>
    <p className="text-sm text-theme-secondary opacity-60">{desc}</p>
  </button>
);

const Xinjing = () => {
  const { showToast } = useToast();
  const { openChat } = useChat();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const [isSmartLinkageOpen, setIsSmartLinkageOpen] = useState(false);

  const checkLogin = (action) => {
    if (user) {
      action();
    } else {
      showToast("请先登录以使用此功能");
      navigateTo('personal');
    }
  };

  const handleDeviceCheck = () => {
    checkLogin(() => showToast("请先连接设备"));
  };

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-8">
        <h2 className="text-3xl font-serif text-theme-primary mb-2">心境</h2>
        <p className="text-theme-secondary opacity-80">万物互联，心境合一。</p>
      </header>

      <div 
        onClick={() => checkLogin(openChat)}
        className="relative mb-8 p-6 bg-theme-surface rounded-3xl border border-theme text-center cursor-pointer hover:bg-theme-surface/80 transition-colors shadow-sm"
      >
        <div className="w-32 h-32 mx-auto bg-theme-primary/5 rounded-full flex items-center justify-center mb-4 relative">
          <div className="absolute inset-0 border border-theme rounded-full animate-ping" />
          <div className="absolute inset-4 border border-theme rounded-full animate-pulse opacity-50" />
          <Wifi size={32} className="text-theme-primary" />
        </div>
        <h3 className="text-xl text-theme-primary font-serif">环境监测中</h3>
        <p className="text-theme-secondary opacity-60 text-sm mt-1">点击开启心声伴侣，同步身心数据...</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <StatusCard 
          icon={Home}
          title="“心境合一”智能联动"
          status="未连接"
          desc="与智能家居联动，打造“视、听、嗅”多感官场景。"
          onClick={() => checkLogin(() => setIsSmartLinkageOpen(true))}
        />
        <StatusCard 
          icon={Activity}
          title="动态生理反馈"
          status="检测中"
          desc="连接穿戴设备，实时反馈生理数据并提供安抚。"
          active={true}
          onClick={handleDeviceCheck}
        />
      </div>

      <SmartLinkageModal isOpen={isSmartLinkageOpen} onClose={() => setIsSmartLinkageOpen(false)} />
    </div>
  );
};

export default Xinjing;
