import React, { useState, useEffect, useRef } from 'react';
import { Persona, Message, Language, CarouselImage } from '../types';
import { startChat, sendMessageToGemini } from '../services/geminiService';
import { PERSONA_DETAILS, KELADI_IMAGES, KITTUR_IMAGES, CHITRADURGA_IMAGES, NANDAGAD_IMAGES, HALAGALI_IMAGES } from '../constants';
import ImageCarousel from './ImageCarousel';
import PersonaAvatar from './PersonaAvatar';

interface ChatScreenProps {
  persona: Persona;
  onBack: () => void;
  language: Language;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ persona, onBack, language }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const personaDetails = PERSONA_DETAILS[persona];

  useEffect(() => {
    startChat(persona);
    const initialMessage: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: language === 'kn' ? personaDetails.introKn : personaDetails.intro,
      persona: persona,
    };
    setMessages([initialMessage]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona, language]);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async (faqQuestion?: string) => {
    const messageText = faqQuestion || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      persona: null,
    };
    setMessages(prev => [...prev, userMessage]);
    
    if (!faqQuestion) {
        setInput('');
    }
    
    setIsLoading(true);

    const botResponseText = await sendMessageToGemini(messageText, persona);

    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: botResponseText,
      persona: persona,
    };
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const parseMarkdown = (rawText: string) => {
    if (!rawText) return { __html: '' };
    const htmlText = rawText
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-k-yellow font-semibold">$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: htmlText };
  };

  const renderBotMessageText = (text: string) => {
    const parts = text.split('---');
    if (parts.length > 1) {
        const kannadaText = parts[0] || '';
        const englishText = parts[1] || '';
        return (
            <>
                <p className="font-kannada" dangerouslySetInnerHTML={parseMarkdown(kannadaText)}></p>
                <hr className="my-2 border-k-yellow/50" />
                <p className="font-english" dangerouslySetInnerHTML={parseMarkdown(englishText)}></p>
            </>
        );
    }
    const fontClass = text.match(/[\u0C80-\u0CFF]/) ? 'font-kannada' : 'font-english';
    return <p className={fontClass} dangerouslySetInnerHTML={parseMarkdown(text)}></p>;
  };

  const getCarouselForPersona = (): { images: CarouselImage[], triggers: string[] } | null => {
      switch(persona) {
        case 'keladi_chennamma':
        case 'nayaka':
            return { images: KELADI_IMAGES, triggers: ['fort', 'keladi', 'ikkeri', 'kavaledurga', 'ಕೋಟೆ', 'ಕೆಳದಿ'] };
        case 'kittur_chennamma':
            return { images: KITTUR_IMAGES, triggers: ['fort', 'kittur', 'battle', 'ಕೋಟೆ', 'ಕಿತ್ತೂರು'] };
        case 'rayanna':
            return { images: NANDAGAD_IMAGES, triggers: ['nandagad', 'forest', 'hanged', 'martyred', 'ನಂದಗಡ'] };
        case 'halagali_bedaru':
            return { images: HALAGALI_IMAGES, triggers: ['halagali', 'village', 'revolt', 'uprising', 'ಹಳಗಳಿ'] };
        case 'onake_obavva':
            return { images: CHITRADURGA_IMAGES, triggers: ['fort', 'chitradurga', 'passage', 'kindi', 'ಕೋಟೆ', 'ಚಿತ್ರದುರ್ಗ'] };
        default:
            return null;
      }
  };

  const getBackgroundStyle = () => {
    const baseGradient = `linear-gradient(to bottom right, #FFD700, #FF0000)`;
    const overlayGradient = `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8))`;

    return {
      backgroundImage: `${overlayGradient}, ${baseGradient}`,
    };
  };

  return (
    <div className="flex flex-col h-full text-white relative">
      <div 
        className="absolute inset-0 bg-no-repeat bg-blend-overlay pointer-events-none"
        style={getBackgroundStyle()}
      ></div>

      <div className="relative flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center p-3 border-b-2 border-k-yellow/50 shadow-lg bg-black/30 backdrop-blur-sm">
          <button onClick={onBack} className="mr-4 bg-k-red text-white p-2 rounded-full hover:bg-red-700 transition-colors">
            &larr;
          </button>
          <PersonaAvatar prompt={personaDetails.imagePrompt} alt={personaDetails.name} className="w-12 h-12 rounded-full border-2 border-k-yellow" />
          <div className="ml-4">
            <h2 className="text-xl font-bold font-kannada text-k-yellow">{language === 'kn' ? personaDetails.kannadaName : personaDetails.name}</h2>
          </div>
        </header>
        
        {/* Messages */}
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const carouselData = getCarouselForPersona();
            const showCarousel = carouselData && msg.id.startsWith('bot-') && carouselData.triggers.some(trigger => msg.text.toLowerCase().includes(trigger));

            return (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <PersonaAvatar prompt={personaDetails.imagePrompt} alt="persona" className="w-8 h-8 rounded-full" />}
                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-lg ${msg.sender === 'user' ? 'bg-k-red text-white rounded-br-none' : 'bg-gradient-to-br from-yellow-500 to-k-red text-white rounded-bl-none'}`}>
                  {msg.sender === 'user' 
                    ? <p className={msg.text.match(/[\u0C80-\u0CFF]/) ? 'font-kannada' : 'font-english'}>{msg.text}</p>
                    : renderBotMessageText(msg.text)
                  }
                  {showCarousel && <ImageCarousel images={carouselData.images} />}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start items-center gap-2">
              <PersonaAvatar prompt={personaDetails.imagePrompt} alt="persona" className="w-8 h-8 rounded-full" />
              <div className="bg-gradient-to-br from-yellow-500 to-k-red p-3 rounded-2xl rounded-bl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-k-yellow rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-k-yellow rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-k-yellow rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div className="h-4"></div> {/* Spacer for scroll end */}
        </main>

        {/* FAQ Suggestions */}
        {!isLoading && messages.length > 0 && (
           <div className="px-4 pb-2 pt-1 flex flex-wrap gap-2 justify-start border-t-2 border-k-yellow/20 bg-black/20">
              {(personaDetails.faq[language]).map((question, index) => (
                  <button
                      key={index}
                      onClick={() => handleSend(question)}
                      className="text-sm font-semibold bg-gray-700/50 border border-k-yellow/60 rounded-full px-3 py-1 hover:bg-k-yellow hover:text-black transition-colors duration-200"
                  >
                      {question}
                  </button>
              ))}
           </div>
        )}

        {/* Input */}
        <footer className="p-3 border-t-2 border-k-yellow/50 bg-black/30 backdrop-blur-sm">
          <div className="flex items-center bg-gray-800 rounded-full p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'kn' ? "ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..." : "Type here..."}
              className={`flex-1 bg-transparent border-none outline-none px-4 text-white ${language === 'kn' ? 'font-kannada' : 'font-english'}`}
              disabled={isLoading}
            />
            <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="bg-k-yellow text-black rounded-full p-2 hover:bg-yellow-300 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatScreen;