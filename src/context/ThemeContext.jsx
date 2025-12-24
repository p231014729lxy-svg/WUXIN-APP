import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('day'); // 'day', 'dusk', 'night'
  const [bgAudio, setBgAudio] = useState(null);

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      
      // Day: 07:00 - 16:59 (辰-申)
      if (hour >= 7 && hour < 17) {
        setTheme('day');
      } 
      // Dusk: 17:00 - 20:59 (酉-戌)
      else if (hour >= 17 && hour < 21) {
        setTheme('dusk');
      } 
      // Night: 21:00 - 06:59 (亥-卯)
      else {
        setTheme('night');
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const themeConfig = {
    day: {
      name: '白昼',
      desc: '辰时 - 申时',
      style: '工笔画风格',
      audio: '清脆鸟鸣、微风',
      background: 'bg-theme-day',
    },
    dusk: {
      name: '黄昏',
      desc: '酉时 - 戌时',
      style: '水墨风格',
      audio: '轻柔海浪、远山晚唱',
      background: 'bg-theme-dusk',
    },
    night: {
      name: '夜晚',
      desc: '亥时 - 卯时',
      style: '写意风格',
      audio: '静谧虫鸣、宇宙音波',
      background: 'bg-theme-night',
    }
  };

  const cycleTheme = () => {
    setTheme(current => {
      if (current === 'day') return 'dusk';
      if (current === 'dusk') return 'night';
      return 'day';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, themeConfig: themeConfig[theme], setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
