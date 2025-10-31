import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { ABOUT_KARNATAKA_KN, ABOUT_KARNATAKA_EN, KARNATAKA_MAP_PROMPT } from '../constants';
import { generateImageFromPrompt } from '../services/geminiService';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from './icons';

const MUSIC_URL = "https://upload.wikimedia.org/wikipedia/commons/1/15/Karnataka_State_Anthem.ogg";

interface AboutKarnatakaProps {
    onBack: () => void;
    language: Language;
}

const AboutKarnataka: React.FC<AboutKarnatakaProps> = ({ onBack, language }) => {
    const content = language === 'kn' ? ABOUT_KARNATAKA_KN : ABOUT_KARNATAKA_EN;
    const fontFamily = language === 'kn' ? 'font-kannada' : 'font-english';
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        let isMounted = true;
        
        const generateMap = async () => {
            setIsLoading(true);
            const url = await generateImageFromPrompt(KARNATAKA_MAP_PROMPT);
            if (isMounted) {
                setBackgroundUrl(url);
                setIsLoading(false);
            }
        };
        generateMap();

        const audio = audioRef.current;
        if (audio) {
            audio.play().then(() => {
                if (isMounted) setIsPlaying(true);
            }).catch(error => {
                console.warn("Audio autoplay was prevented by the browser.", error);
                if (isMounted) setIsPlaying(false);
            });
        }

        return () => {
            isMounted = false;
            if (audio) {
                audio.pause();
            }
        };
    }, []);

    const toggleAudio = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const backgroundStyle = {
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
        backgroundColor: '#111', // Dark fallback
    };

    return (
        <div 
            className="h-full w-full bg-cover bg-center relative transition-background-image duration-500"
            style={backgroundStyle}
        >
            <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />
            <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}></div>
            {isLoading && (
                 <div className="absolute inset-0 bg-black/90 flex items-center justify-center text-k-yellow font-english">
                    <p>Generating map of Karnataka...</p>
                 </div>
            )}
            <div className="relative p-6 md:p-8 text-white h-full overflow-y-auto">
                <button onClick={onBack} className="mb-6 bg-k-red text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 transition-colors z-10 sticky top-0">
                    &larr; {language === 'kn' ? 'ಹಿಂದೆ' : 'Back'}
                </button>
                <button onClick={toggleAudio} className="absolute top-4 right-4 z-20 bg-black/50 p-2 rounded-full text-white hover:bg-k-yellow hover:text-black transition-colors">
                    {isPlaying ? <SpeakerWaveIcon className="w-6 h-6" /> : <SpeakerXMarkIcon className="w-6 h-6" />}
                </button>

                <h1 className={`text-3xl md:text-4xl font-bold text-k-yellow mb-6 text-center ${fontFamily}`}>{content.title}</h1>
                
                <div className="space-y-8 max-w-xl mx-auto">
                    {content.sections.map((section, index) => (
                        <div key={index} className="bg-black/40 p-4 rounded-lg border border-k-yellow/50">
                            <h2 className={`text-2xl font-bold text-k-yellow mb-3 ${fontFamily}`}>{section.heading}</h2>
                            <p className={`text-lg leading-relaxed ${fontFamily}`}>{section.content}</p>
                        </div>
                    ))}
                </div>
                 <div className="h-8"></div>
            </div>
        </div>
    );
};

export default AboutKarnataka;