import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Loader2, ArrowRight, Search } from 'lucide-react';
import { chatWithAI } from '../services/deepseek';

const AncientWisdomModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0); // 0: Select, 1: Loading, 2: Result
  const [selectedBook, setSelectedBook] = useState('');
  const [result, setResult] = useState('');

  const books = ['黄帝内经', '道德经', '庄子', '金刚经', '心经', '周易'];

  const handleSelect = async (book) => {
    setSelectedBook(book);
    setStep(1);
    try {
      const prompt = `
        用户选择了古籍《${book}》。
        请基于该古籍的核心思想，生成一个简短的引导式冥想方案。
        要求：
        1. 引用一句经典原文。
        2. 设计一段3分钟左右的冥想引导词（约200字）。
        3. 语气古朴、宁静、具有疗愈感。
      `;
      
      const response = await chatWithAI([{ role: 'user', content: prompt }]);
      setResult(response);
      setStep(2);
    } catch (error) {
      setResult("抱歉，古籍阁暂时关闭，请稍后再试。");
      setStep(2);
    }
  };

  const handleReset = () => {
    setStep(0);
    setSelectedBook('');
    setResult('');
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
                <BookOpen className="text-theme-primary" size={20} />
                <h3 className="font-serif text-theme-primary text-lg">古籍智慧导引</h3>
              </div>
              <button onClick={onClose} className="p-1 text-theme-secondary hover:text-theme-primary rounded-full hover:bg-theme-surface">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {step === 0 && (
                <>
                  <p className="text-theme-secondary mb-6 text-sm text-center">请选择您想感悟的经典：</p>
                  <div className="grid grid-cols-2 gap-4">
                    {books.map(book => (
                      <button
                        key={book}
                        onClick={() => handleSelect(book)}
                        className="p-4 rounded-xl border border-theme bg-theme-surface hover:bg-[var(--color-accent)] hover:text-[var(--color-bg-primary)] text-theme-primary font-serif text-lg transition-all shadow-sm"
                      >
                        {book}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 1 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 size={40} className="text-theme-primary animate-spin mb-4" />
                  <p className="text-theme-secondary text-sm">正在翻阅古籍，寻觅智慧...</p>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-xs text-[var(--color-accent)] border border-[var(--color-accent)] px-2 py-0.5 rounded-full">
                        {selectedBook}
                    </span>
                  </div>
                  <div className="bg-theme-surface border border-theme rounded-2xl p-6 shadow-inner">
                    <div className="text-theme-primary leading-loose whitespace-pre-wrap text-sm font-serif">
                      {result}
                    </div>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="w-full py-3 text-theme-secondary hover:text-theme-primary text-sm flex items-center justify-center gap-2"
                  >
                    <Search size={16} /> 探索其他经典
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

export default AncientWisdomModal;
