import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, ArrowRight, Lightbulb, Wind, Music, Check } from 'lucide-react';
import { chatWithAI } from '../services/deepseek';
import { useHealth } from '../context/HealthContext';
import { useToast } from '../context/ToastContext';

const SmartLinkageModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0); // 0: Select/Input, 1: Loading, 2: Result
  const [theme, setTheme] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState(null);
  const { saveRecommendations } = useHealth(); // Reusing health context or we could create a new one
  const { showToast } = useToast();

  const themes = ['秋日疏林', '雨后空山', '古刹禅钟', '云端漫步'];

  const handleDiagnose = async (selectedTheme) => {
    setStep(1);
    try {
      const prompt = `
        用户选择了冥想主题：“${selectedTheme}”。
        请为该主题设计一个“心境合一”的智能家居联动方案。
        请输出以下内容（JSON格式）：
        {
          "scene": "场景描述（30字以内）",
          "lights": "灯光颜色和亮度建议",
          "scent": "香薰气味建议",
          "music": "背景音乐类型",
          "devices": ["联动的设备1", "联动的设备2"]
        }
      `;
      
      const response = await chatWithAI([{ role: 'user', content: prompt }]);
      // Simple parsing or just display text if JSON fails. For robustness, we'll try to parse or just show formatted text.
      // Since chatWithAI returns text, we might need to parse it if we want structured data. 
      // For now, let's assume we display it nicely or ask AI to return formatted text.
      // Let's adjust prompt to return structured text for easier display if parsing is risky without a robust parser.
      
      const structuredPrompt = `
        用户选择了冥想主题：“${selectedTheme}”。
        请为该主题设计一个“心境合一”的智能家居联动方案。
        请按以下格式输出：
        场景：[简短描述]
        灯光：[颜色/亮度]
        香薰：[气味]
        音乐：[类型]
        设备：[设备列表]
      `;
       const textResponse = await chatWithAI([{ role: 'user', content: structuredPrompt }]);
       setResult(textResponse);
       setStep(2);
    } catch (error) {
      setResult("抱歉，无法连接智能中枢，请稍后再试。");
      setStep(2);
    }
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      handleDiagnose(customInput);
    }
  };

  const handleImmersion = () => {
    onClose();
    showToast("请先连接设备");
    setTimeout(() => {
        setStep(0);
        setTheme('');
        setCustomInput('');
        setResult(null);
    }, 500);
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
                <Sparkles className="text-theme-primary" size={20} />
                <h3 className="font-serif text-theme-primary text-lg">智能场景定制</h3>
              </div>
              <button onClick={onClose} className="p-1 text-theme-secondary hover:text-theme-primary rounded-full hover:bg-theme-surface">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {step === 0 && (
                <>
                  <p className="text-theme-secondary mb-4 text-sm">请选择或输入您想要的冥想意境：</p>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {themes.map(t => (
                      <button
                        key={t}
                        onClick={() => handleDiagnose(t)}
                        className="p-3 rounded-xl border border-theme bg-theme-surface hover:bg-theme-surface/80 text-theme-primary text-sm font-medium transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="自定义场景（如：深海沉潜）"
                      className="w-full p-3 pr-12 rounded-xl bg-theme-surface border border-theme text-theme-primary placeholder-theme-secondary/50 focus:outline-none focus:ring-1 focus:ring-theme-primary"
                    />
                    <button 
                      onClick={handleCustomSubmit}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-theme-primary text-[var(--color-bg-primary)] rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 size={40} className="text-theme-primary animate-spin mb-4" />
                  <p className="text-theme-secondary text-sm">正在调配光影与香氛...</p>
                </div>
              )}

              {step === 2 && result && (
                <div className="space-y-4">
                  <div className="bg-theme-surface border border-theme rounded-2xl p-5 text-sm text-theme-secondary leading-relaxed whitespace-pre-wrap">
                    {result}
                  </div>
                  
                  {/* Visual Mock of Linked Devices */}
                  <div className="flex justify-between px-4 py-2">
                    <div className="flex flex-col items-center gap-1 text-theme-primary">
                        <Lightbulb size={20} />
                        <span className="text-xs">灯光已就绪</span>
                    </div>
                     <div className="flex flex-col items-center gap-1 text-theme-primary">
                        <Wind size={20} />
                        <span className="text-xs">香氛已同步</span>
                    </div>
                     <div className="flex flex-col items-center gap-1 text-theme-primary">
                        <Music size={20} />
                        <span className="text-xs">音律已加载</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleImmersion}
                    className="w-full btn-theme font-bold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} /> 一键沉浸
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SmartLinkageModal;
