import React, { useState, useEffect } from 'react';
import { Language, Persona } from '../types';
import { PERSONA_DETAILS } from '../constants';
import { generateImageFromPrompt } from '../services/geminiService';

interface PersonasScreenProps {
    onBack: () => void;
    language: Language;
    onSelectPersona: (persona: Persona) => void;
}

const PersonaCard: React.FC<{ persona: Persona, language: Language }> = ({ persona, language }) => {
    const details = PERSONA_DETAILS[persona];
    const isKannada = language === 'kn';
    const fontFamily = isKannada ? 'font-kannada' : 'font-english';
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

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

    if (!details.description || !details.descriptionKn) return null;

    return (
        <div className="bg-black/50 backdrop-blur-sm border-2 border-k-yellow/60 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-k-yellow flex-shrink-0 overflow-hidden">
                {isLoading ? (
                    <div className="w-full h-full bg-gray-700 animate-pulse" />
                ) : imageUrl ? (
                    <img src={imageUrl} alt={details.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-800" />
                )}
            </div>
            <div className="text-center sm:text-left">
                <h3 className={`text-2xl font-bold text-k-yellow mb-2 ${fontFamily}`}>
                    {isKannada ? details.kannadaName : details.name}
                </h3>
                <p className={`text-white leading-relaxed ${fontFamily}`}>
                    {isKannada ? details.descriptionKn : details.description}
                </p>
            </div>
        </div>
    );
};

const PersonasScreen: React.FC<PersonasScreenProps> = ({ onBack, language, onSelectPersona }) => {
    const isKannada = language === 'kn';
    const fontFamily = isKannada ? 'font-kannada' : 'font-english';

    const kingdomBuilders: Persona[] = ['keladi_chennamma', 'nayaka'];
    const freedomFighters: Persona[] = ['kittur_chennamma', 'rayanna', 'halagali_bedaru', 'onake_obavva'];
    
    const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
      <h2 className={`text-3xl font-bold text-white text-center my-6 ${fontFamily}`}>{title}</h2>
    );

    return (
        <div className="relative p-4 md:p-6 text-white h-full overflow-y-auto">
            <button onClick={onBack} className="mb-4 bg-k-red text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 transition-colors z-10 sticky top-0">
                &larr; {isKannada ? 'ಹಿಂದೆ' : 'Back'}
            </button>
            <h1 className={`text-4xl font-bold text-k-yellow mb-4 text-center ${fontFamily}`}>
                {isKannada ? 'ನಮ್ಮ ನಾಯಕರನ್ನು ತಿಳಿಯಿರಿ' : 'Know Your Heroes'}
            </h1>
            
            <div className="space-y-8 max-w-3xl mx-auto">
                <div>
                    <SectionHeader title={isKannada ? "ಸಾಮ್ರಾಜ್ಯದ ನಿರ್ಮಾಪಕರು" : "Kingdom Builders"} />
                    <div className="space-y-4">
                        {kingdomBuilders.map(p => <PersonaCard key={p} persona={p} language={language} />)}
                    </div>
                </div>
                <div>
                    <SectionHeader title={isKannada ? "ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟಗಾರರು" : "Freedom Fighters"} />
                    <div className="space-y-4">
                        {freedomFighters.map(p => <PersonaCard key={p} persona={p} language={language} />)}
                    </div>
                </div>

                {/* Chat with Historian Section */}
                <div className="mt-12 text-center">
                    <button 
                        onClick={() => onSelectPersona('historian')}
                        className="bg-k-yellow text-black font-bold font-english py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors duration-300 shadow-lg text-lg"
                    >
                        {isKannada ? "ಇತಿಹಾಸಕಾರರನ್ನು ಕೇಳಿ" : "Ask the Historian"}
                    </button>
                </div>
            </div>
            <div className="h-8"></div>
        </div>
    );
};

export default PersonasScreen;