import React from 'react';
import { User, Flower2, Brain, Users, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'zhiji', label: '知己', icon: User },
    { id: 'xiuxing', label: '修行', icon: Flower2 },
    { id: 'xinjing', label: '心境', icon: Brain },
    { id: 'chenyuan', label: '尘缘', icon: Users },
    { id: 'shiqu', label: '拾趣', icon: Sparkles },
    { id: 'personal', label: '个人', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-primary-950/90 backdrop-blur-lg border-t border-primary-800/30 pb-safe pt-2 px-4 z-40">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center w-full py-2 group"
            >
              <div
                className={clsx(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive ? "bg-primary-800/50 text-gold-400" : "text-primary-400/70 group-hover:text-primary-300"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span
                className={clsx(
                  "text-xs mt-1 transition-colors font-medium",
                  isActive ? "text-gold-400" : "text-primary-400/70"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar;
