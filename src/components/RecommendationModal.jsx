import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, RefreshCw, Music, Clock, Moon, ArrowRight } from 'lucide-react';
import { useHealth } from '../context/HealthContext';
import { chatWithAI } from '../services/deepseek';
import TwelveHoursModal from './TwelveHoursModal';
import SleepTherapyModal from './SleepTherapyModal';
import { useToast } from '../context/ToastContext';

const RecommendationModal = ({ isOpen, onClose }) => {
  const { healthProfile, recommendations, saveRecommendations } = useHealth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [showTwelve, setShowTwelve] = useState(false);
  const [showSleep, setShowSleep] = useState(false);

  const handleFiveTones = () => {
      showToast("请前往【修行】页面体验五音疗法");
  };

  useEffect(() => {
    if (isOpen && healthProfile && !recommendations && !loading) {
      fetchRecommendations();
    }
  }, [isOpen, healthProfile, recommendations]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `
        基于用户的中医体质档案：
        ${healthProfile.diagnosis}
        
        请为该用户提供个性化的养生推荐方案，包含以下三个方面：
        1. 【食疗】推荐食材、药膳或忌口。
        2. 【起居】作息建议、运动方式。
        3. 【情志】情绪调节建议。
        
        要求：分点陈述，条理清晰，语气温暖鼓励。字数200字左右。
      `;
      
      const result = await chatWithAI([{ role: 'user', content: prompt }]);
      saveRecommendations(result);
    } catch (err) {
      setError("获取推荐失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    saveRecommendations(null); // Clear current to trigger effect
    fetchRecommendations();
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
            className="w-full max-w-sm bg-primary-950 border border-primary-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-primary-800/50 flex justify-between items-center bg-primary-900/50">
              <div className="flex items-center gap-2">
                <Sparkles className="text-gold-400" size={20} />
                <h3 className="font-serif text-white text-lg">个性化推荐</h3>
              </div>
              <button onClick={onClose} className="p-1 text-primary-500 hover:text-white rounded-full hover:bg-primary-800 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {!healthProfile ? (
                <div className="text-center py-12">
                  <p className="text-primary-300 mb-2">未找到体质档案</p>
                  <p className="text-xs text-primary-500 mb-6">无法为您定制方案，请先完成测评</p>
                  <button onClick={onClose} className="text-gold-400 text-sm hover:underline">
                    去测评
                  </button>
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={40} className="text-gold-400 animate-spin mb-4" />
                  <p className="text-primary-300 text-sm">正在为您定制专属方案...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-400 mb-4">{error}</p>
                  <button onClick={fetchRecommendations} className="px-4 py-2 bg-primary-800 rounded-lg text-white text-sm">
                    重试
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-primary-900/50 to-primary-800/30 border border-gold-500/20 rounded-2xl p-5">
                    <div className="text-primary-100 leading-relaxed whitespace-pre-wrap text-sm">
                      {recommendations}
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleRefresh}
                    className="w-full py-3 flex items-center justify-center gap-2 text-primary-400 hover:text-white transition-colors text-sm"
                  >
                    <RefreshCw size={14} /> 重新生成
                  </button>

                  {/* Curated Recommendations */}
                  <div className="mt-6 pt-6 border-t border-primary-800/50">
                     <h4 className="text-gold-400 font-serif mb-4 flex items-center gap-2 text-sm">
                        <Sparkles size={14} /> 精选调养方案
                     </h4>
                     <div className="space-y-3">
                        <button onClick={handleFiveTones} className="w-full p-3 bg-primary-800/30 hover:bg-primary-800/50 rounded-xl border border-primary-800 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-blue-500/20 text-blue-400"><Music size={16} /></div>
                                <div className="text-left">
                                    <h5 className="text-primary-100 text-sm font-medium">五音疗法</h5>
                                    <p className="text-xs text-primary-500">宫商角徵羽，调理脏腑</p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-primary-600 group-hover:text-gold-400" />
                        </button>
                        
                        <button onClick={() => setShowTwelve(true)} className="w-full p-3 bg-primary-800/30 hover:bg-primary-800/50 rounded-xl border border-primary-800 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-500/20 text-green-400"><Clock size={16} /></div>
                                <div className="text-left">
                                    <h5 className="text-primary-100 text-sm font-medium">十二时辰养生</h5>
                                    <p className="text-xs text-primary-500">顺应天时，规律作息</p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-primary-600 group-hover:text-gold-400" />
                        </button>

                        <button onClick={() => setShowSleep(true)} className="w-full p-3 bg-primary-800/30 hover:bg-primary-800/50 rounded-xl border border-primary-800 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-500/20 text-purple-400"><Moon size={16} /></div>
                                <div className="text-left">
                                    <h5 className="text-primary-100 text-sm font-medium">安寝方</h5>
                                    <p className="text-xs text-primary-500">助眠安神，一夜好梦</p>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-primary-600 group-hover:text-gold-400" />
                        </button>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Nested Modals */}
      {showTwelve && <TwelveHoursModal isOpen={showTwelve} onClose={() => setShowTwelve(false)} />}
      {showSleep && <SleepTherapyModal isOpen={showSleep} onClose={() => setShowSleep(false)} />}
    </AnimatePresence>
  );
};

export default RecommendationModal;
