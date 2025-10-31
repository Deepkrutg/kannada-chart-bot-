import React, { useState } from 'react';
import { View, Persona, Language } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import ChatScreen from './components/ChatScreen';
import { FLAG_ANIMATION_URL } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [language, setLanguage] = useState<Language>('kn');
  const [fade, setFade] = useState(true);

  const switchView = (newView: View) => {
    setFade(false);
    setTimeout(() => {
        setCurrentView(newView);
        setFade(true);
    }, 300);
  };

  const handleSelectPersona = (persona: Persona) => {
    setCurrentPersona(persona);
    switchView('chat');
  };
  
  const handleSelectAbout = () => {
    handleSelectPersona('karnataka');
  };
  
  const handleSelectKnowMore = () => {
      handleSelectPersona('historian');
  }

  const handleBack = () => {
    setCurrentPersona(null);
    switchView('welcome');
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => prev === 'kn' ? 'en' : 'kn');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'chat':
        return currentPersona && <ChatScreen persona={currentPersona} onBack={handleBack} language={language} />;
      case 'welcome':
      default:
        return <WelcomeScreen onSelectPersona={handleSelectPersona} onSelectAbout={handleSelectAbout} onSelectKnowMore={handleSelectKnowMore} onToggleLanguage={handleToggleLanguage} language={language} />;
    }
  };

  return (
    <div 
      className="h-screen w-screen bg-cover bg-center font-english relative overflow-hidden"
      style={{ 
        backgroundImage: (currentView === 'chat') ? `url(${FLAG_ANIMATION_URL})` : 'none',
        backgroundColor: '#111' 
      }}
    >
      <div 
        className="h-full w-full backdrop-brightness-75 relative"
        style={{ background: 'linear-gradient(to bottom right, rgba(255, 215, 0, 0.4), rgba(255, 0, 0, 0.5))' }}
      >
          <div className={`h-full ${currentView === 'chat' ? '' : 'max-w-2xl mx-auto'} transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              {renderContent()}
          </div>
      </div>
    </div>
  );
};

export default App;