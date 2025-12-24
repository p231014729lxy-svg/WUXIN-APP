import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { chatWithAI } from '../services/deepseek';
import { useHealth } from '../context/HealthContext';
import { useToast } from '../context/ToastContext';

const DiagnosisModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0); // 0: Intro, 1: Questions, 2: Loading, 3: Result
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState('');
  const { saveProfile } = useHealth();
  const { showToast } = useToast();

  const questions = [
    {
      id: 'sleep',
      title: '您的睡眠质量如何？',
      options: ['入睡困难，易醒多梦', '睡不安稳，时睡时醒', '嗜睡困倦，睡不醒', '睡眠正常，精力充沛']
    },
    {
      id: 'appetite',
      title: '您的饮食胃口如何？',
      options: ['食欲不振，胃胀不适', '喜热饮，吃冷胃痛', '口干口苦，喜冷饮', '胃口正常，消化良好']
    },
    {
      id: 'energy',
      title: '您日常的精神状态？',
      options: ['容易疲劳，气短懒言', '烦躁易怒，情绪波动', '手脚冰凉，怕冷', '精神饱满，情绪稳定']
    },
    {
      id: 'tongue',
      title: '观察您的舌苔情况？',
      options: ['舌淡红，苔薄白', '舌红，苔黄腻', '舌淡胖，有齿痕', '舌紫暗，有瘀点']
    }
  ];

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: option });
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };

  const handleDiagnose = async () => {
    setStep(2);
    try {
      const prompt = `
        请根据以下用户中医体质自测结果进行辨识：
        1. 睡眠：${answers.sleep}
        2. 饮食：${answers.appetite}
        3. 精神：${answers.energy}
        4. 舌象：${answers.tongue}
        
        请输出：
        1. 核心体质（如气虚、阳虚、湿热等）。
        2. 简短的调理建议（饮食、起居）。
        字数控制在150字以内，语气专业且亲切。
      `;
      
      const response = await chatWithAI([{ role: 'user', content: prompt }]);
      setResult(response);
      setStep(3);
    } catch (error) {
      setResult("抱歉，AI诊断服务暂时不可用，请稍后再试。");
      setStep(3);
    }
  };

  const handleSave = () => {
    saveProfile(result);
    showToast("已成功收入健康档案");
    onClose();
    setTimeout(() => {
        setStep(0);
        setCurrentQuestion(0);
        setAnswers({});
        setResult('');
    }, 500);
  };

  const handleBack = () => {
    if (step === 1) {
      if (currentQuestion > 0) {
        setCurrentQuestion(curr => curr - 1);
      } else {
        setStep(0);
      }
    }
    if (step === 3) setStep(1);
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-theme-surface rounded-full mx-auto flex items-center justify-center mb-6 relative">
               <div className="absolute inset-0 border border-theme rounded-full animate-spin-slow" />
               <Activity size={40} className="text-theme-secondary" />
            </div>
            <h3 className="text-2xl font-serif text-theme-primary mb-4">AI 中医体质辨识</h3>
            <p className="text-theme-secondary opacity-80 mb-8 leading-relaxed">
              结合传统望闻问切智慧与现代AI技术，<br/>为您生成专属健康档案。
            </p>
            <button 
              onClick={() => setStep(1)}
              className="w-full btn-theme font-bold py-3 rounded-xl transition-colors shadow-lg"
            >
              体质自测
            </button>
          </div>
        );
      case 1:
        const q = questions[currentQuestion];
        return (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs text-theme-secondary font-medium">问题 {currentQuestion + 1} / {questions.length}</span>
              <div className="w-1/3 h-1 bg-theme-surface rounded-full">
                <div 
                  className="h-full bg-theme-primary rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, backgroundColor: 'var(--color-text-primary)' }}
                />
              </div>
            </div>
            
            <h3 className="text-xl font-serif text-theme-primary mb-6">{q.title}</h3>
            
            <div className="space-y-3">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full p-4 rounded-xl text-left transition-all border ${
                    answers[q.id] === option 
                      ? 'btn-theme shadow-lg border-transparent' 
                      : 'bg-theme-surface border-theme text-theme-primary hover:bg-theme-surface/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {answers[q.id] === option && <Check size={18} className="text-[var(--color-bg-primary)]" />}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              {currentQuestion === questions.length - 1 && Object.keys(answers).length === questions.length && (
                <button 
                  onClick={handleDiagnose}
                  className="btn-theme font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                >
                  生成报告 <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6">
            <Loader2 size={48} className="text-theme-primary animate-spin mb-4" />
            <h3 className="text-lg text-theme-primary mb-2">正在分析脉象...</h3>
            <p className="text-sm text-theme-secondary">AI正在查阅古籍医案</p>
          </div>
        );
      case 3:
        return (
          <div className="p-6">
            <div className="bg-theme-surface border border-theme rounded-2xl p-5 mb-6 max-h-[50vh] overflow-y-auto">
              <h3 className="text-xl font-serif text-theme-primary mb-4 border-b border-theme pb-2">诊断结果</h3>
              <div className="text-theme-secondary leading-relaxed whitespace-pre-wrap text-sm">
                {result}
              </div>
            </div>
            <button 
              onClick={handleSave}
              className="w-full btn-theme font-bold py-3 rounded-xl transition-colors shadow-lg"
            >
              收入健康档案
            </button>
          </div>
        );
      default:
        return null;
    }
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
            className="w-full max-w-sm bg-[var(--color-bg-primary)] border border-theme rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Header Actions */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                {step > 0 && step !== 2 && (
                    <button 
                        onClick={handleBack} 
                        className="text-theme-primary hover:text-theme-secondary pointer-events-auto p-1 rounded-full hover:bg-theme-surface"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}
                {/* Spacer if no back button to keep Close button on right */}
                {step === 0 || step === 2 ? <div /> : null}
                
                <button 
                    onClick={onClose} 
                    className="text-theme-primary hover:text-theme-secondary pointer-events-auto p-1 rounded-full hover:bg-theme-surface"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Spacer for header */}
            <div className="h-12" />

            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DiagnosisModal;
