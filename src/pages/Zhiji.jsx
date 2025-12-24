import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { useUser } from '../context/UserContext';
import { useNavigation } from '../context/NavigationContext';
import { ScanFace, FileText, Sparkles } from 'lucide-react';
import DiagnosisModal from '../components/DiagnosisModal';
import ProfileModal from '../components/ProfileModal';
import RecommendationModal from '../components/RecommendationModal';

const FeatureCard = ({ title, desc, icon: Icon, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-6 rounded-2xl bg-theme-surface border border-theme backdrop-blur-sm mb-4 group hover:bg-theme-surface/80 transition-all active:scale-[0.98] shadow-sm"
  >
    <div className="flex items-start justify-between mb-3">
      <div 
        className="p-3 rounded-xl transition-colors"
        style={{ backgroundColor: 'var(--color-card-icon-bg)', color: 'var(--color-card-icon-fg)' }}
      >
        <Icon size={24} />
      </div>
      <div className="text-theme-secondary text-xs px-2 py-1 rounded-full border border-theme opacity-70">
        点击体验
      </div>
    </div>
    <h3 className="text-xl font-serif text-theme-primary mb-1">{title}</h3>
    <p className="text-theme-secondary text-sm leading-relaxed opacity-80">{desc}</p>
  </button>
);

const Zhiji = () => {
  const { showToast } = useToast();
  const { user } = useUser();
  const { navigateTo } = useNavigation();
  const [isDiagnosisOpen, setIsDiagnosisOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRecOpen, setIsRecOpen] = useState(false);
  const handleDev = () => showToast("正在开发中，敬请期待！");

  const checkLogin = (action) => {
    if (user) {
      action();
    } else {
      showToast("请先登录以使用此功能");
      navigateTo('personal');
    }
  };

  return (
    <div className="p-6 pt-12 pb-24">
      <header className="mb-8">
        <h2 className="text-3xl font-serif text-theme-primary mb-2">知己</h2>
        <p className="text-theme-secondary opacity-80">了解自身，为精准养生提供科学依据。</p>
      </header>

      <div className="space-y-2">
        <FeatureCard 
          title="智能体质自测" 
          desc="通过AI面诊、舌诊及问卷，综合评估用户中医体质。" 
          icon={ScanFace}
          onClick={() => checkLogin(() => setIsDiagnosisOpen(true))}
        />
        <FeatureCard 
          title="生成体质档案" 
          desc="输出图文并茂、通俗易懂的体质报告与养生总纲。" 
          icon={FileText}
          onClick={() => checkLogin(() => setIsProfileOpen(true))}
        />
        <FeatureCard 
          title="个性化推荐引擎" 
          desc="根据体质报告，自动为用户在各模块中推荐最适宜的内容。" 
          icon={Sparkles}
          onClick={() => checkLogin(() => setIsRecOpen(true))}
        />
      </div>

      <DiagnosisModal isOpen={isDiagnosisOpen} onClose={() => setIsDiagnosisOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <RecommendationModal isOpen={isRecOpen} onClose={() => setIsRecOpen(false)} />
    </div>
  );
};

export default Zhiji;
