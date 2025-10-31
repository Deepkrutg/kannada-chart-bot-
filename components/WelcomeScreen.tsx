
import React, { useState, useEffect } from 'react';
import { Persona, Language } from '../types';
import { PERSONA_DETAILS } from '../constants';
import { generateImageFromPrompt } from '../services/geminiService';
import { KarnatakaIcon, HistorianIcon } from './icons';

interface WelcomeScreenProps {
  onSelectPersona: (persona: Persona) => void;
  onSelectAbout: () => void;
  onSelectKnowMore: () => void;
  onToggleLanguage: () => void;
  language: Language;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectPersona, onSelectAbout, onSelectKnowMore, onToggleLanguage, language }) => {
  const isKannada = language === 'kn';

  const kingdomBuilders: Persona[] = ['keladi_chennamma', 'nayaka'];
  const freedomFighters: Persona[] = ['kittur_chennamma', 'rayanna', 'halagali_bedaru', 'onake_obavva'];

  const PersonaButton: React.FC<{ persona: Persona }> = ({ persona }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const details = PERSONA_DETAILS[persona];

    useEffect(() => {
        let isMounted = true;
        const generate = async () => {
            setIsLoading(true);
            const url = await generateImageFromPrompt(details.imagePrompt);
            if (isMounted) {
                setImageUrl(url);
                setIsLoading(false);
            }
        };
        generate();
        return () => { isMounted = false; };
    }, [details.imagePrompt]);

    return (
        <button onClick={() => onSelectPersona(persona)} className="group bg-black/50 backdrop-blur-sm border-2 border-k-yellow rounded-lg p-4 hover:bg-k-yellow/20 transition-all duration-300 transform hover:scale-105 flex flex-col items-center h-full">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-3 border-4 border-k-yellow group-hover:border-white overflow-hidden flex-shrink-0">
                {isLoading ? (
                    <div className="w-full h-full bg-gray-700 animate-pulse" />
                ) : imageUrl ? (
                    <img src={imageUrl} alt={details.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center text-k-yellow text-xs text-center">Failed</div>
                )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-kannada text-k-yellow group-hover:text-white">{isKannada ? details.kannadaName : details.name}</h2>
        </button>
    );
  };

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
      <h3 className="text-xl md:text-2xl font-english text-white font-semibold mt-6 mb-4 border-b-2 border-k-yellow/50 pb-2">{title}</h3>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white p-4 overflow-y-auto">
      <h1 className="text-4xl md:text-5xl font-bold font-kannada text-k-yellow drop-shadow-lg mb-2">
        {isKannada ? "ಹಾರ್ದಿಕ ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು!" : "Hearty Kannada Rajyotsava Wishes!"}
      </h1>
      <p className="text-lg md:text-xl font-english mb-4">
        {isKannada ? "ನಿಮ್ಮ ನಾಯಕರೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ:" : "Chat with your heroes:"}
      </p>

      <div className="w-full max-w-3xl">
        <SectionHeader title={isKannada ? "ಸಾಮ್ರಾಜ್ಯದ ನಿರ್ಮಾಪಕರು" : "Kingdom Builders"} />
        <div className="grid grid-cols-2 gap-4">
            {kingdomBuilders.map(p => <PersonaButton key={p} persona={p} />)}
        </div>

        <SectionHeader title={isKannada ? "ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು" : "Freedom Fighters"} />
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            {freedomFighters.map(p => <PersonaButton key={p} persona={p} />)}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mt-8">
         <button onClick={onSelectAbout} className="bg-k-red text-white font-bold font-english py-2 px-6 rounded-full hover:bg-red-700 transition-colors duration-300 shadow-lg flex items-center justify-center gap-2">
          <KarnatakaIcon className="w-5 h-5" />
          <span>{isKannada ? "ಕರ್ನಾಟಕದ ಬಗ್ಗೆ" : "About Karnataka"}</span>
        </button>
        <button onClick={onSelectKnowMore} className="bg-k-yellow text-black font-bold font-english py-2 px-6 rounded-full hover:bg-yellow-300 transition-colors duration-300 shadow-lg flex items-center justify-center gap-2">
          <HistorianIcon className="w-5 h-5" />
          <span>{isKannada ? "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ" : "Know More"}</span>
        </button>
        <button onClick={onToggleLanguage} className="bg-transparent border-2 border-k-yellow text-k-yellow font-bold font-english py-2 px-6 rounded-full hover:bg-k-yellow hover:text-black transition-colors duration-300 shadow-lg">
          {isKannada ? "Switch to English" : "ಕನ್ನಡಕ್ಕೆ ಬದಲಿಸಿ"}
        </button>
      </div>
      <div className="h-6"></div>
    </div>
  );
};

export default WelcomeScreen;
