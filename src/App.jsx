import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { HealthProvider } from './context/HealthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { AudioProvider } from './context/AudioContext';
import { UserProvider } from './context/UserContext';
import { NavigationProvider } from './context/NavigationContext';
import Layout from './components/Layout';
import Splash from './pages/Splash';
import Zhiji from './pages/Zhiji';
import Xiuxing from './pages/Xiuxing';
import Xinjing from './pages/Xinjing';
import Chenyuan from './pages/Chenyuan';
import Shiqu from './pages/Shiqu';
import Personal from './pages/Personal';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('zhiji');

  const handleEnter = () => {
    setShowSplash(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'zhiji': return <Zhiji />;
      case 'xiuxing': return <Xiuxing />;
      case 'xinjing': return <Xinjing />;
      case 'chenyuan': return <Chenyuan />;
      case 'shiqu': return <Shiqu />;
      case 'personal': return <Personal />;
      default: return <Zhiji />;
    }
  };

  if (showSplash) {
    return <Splash onEnter={handleEnter} />;
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <HealthProvider>
          <ChatProvider>
            <AudioProvider>
              <UserProvider>
                <NavigationProvider activeTab={activeTab} setActiveTab={setActiveTab}>
                  <Layout activeTab={activeTab} onTabChange={setActiveTab}>
                    {renderContent()}
                  </Layout>
                </NavigationProvider>
              </UserProvider>
            </AudioProvider>
          </ChatProvider>
        </HealthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
