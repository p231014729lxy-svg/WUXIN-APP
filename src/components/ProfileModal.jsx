import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Calendar } from 'lucide-react';
import { useHealth } from '../context/HealthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { healthProfile } = useHealth();

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
                <FileText className="text-gold-400" size={20} />
                <h3 className="font-serif text-white text-lg">我的体质档案</h3>
              </div>
              <button onClick={onClose} className="p-1 text-primary-500 hover:text-white rounded-full hover:bg-primary-800 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {healthProfile ? (
                <>
                  <div className="flex items-center gap-2 text-xs text-primary-500 mb-4">
                    <Calendar size={12} />
                    <span>生成于: {new Date(healthProfile.timestamp).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="bg-primary-900/40 border border-gold-500/20 rounded-2xl p-5 mb-6">
                    <div className="text-primary-100 leading-relaxed whitespace-pre-wrap text-sm">
                      {healthProfile.diagnosis}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-primary-500/60 italic">
                      *此档案将作为个性化推荐的依据
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <FileText size={32} />
                  </div>
                  <p className="text-primary-300 mb-2">暂无体质档案</p>
                  <p className="text-xs text-primary-500 mb-6">请先完成智能体质自测</p>
                  <button onClick={onClose} className="text-gold-400 text-sm hover:underline">
                    返回进行测试
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

export default ProfileModal;
