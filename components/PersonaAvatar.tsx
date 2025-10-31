import React, { useState, useEffect } from 'react';
import { generateImageFromPrompt } from '../services/geminiService';

const PersonaAvatar: React.FC<{ prompt: string; alt: string; className?: string; }> = ({ prompt, alt, className }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const generate = async () => {
            setIsLoading(true);
            const url = await generateImageFromPrompt(prompt);
            if (isMounted) {
                setImageUrl(url);
                setIsLoading(false);
            }
        };
        generate();
        return () => { isMounted = false; };
    }, [prompt]);

    return (
        <div className={`${className} overflow-hidden flex-shrink-0`}>
            {isLoading ? (
                <div className="w-full h-full bg-gray-700 animate-pulse" />
            ) : imageUrl ? (
                <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-800" />
            )}
        </div>
    );
};

export default PersonaAvatar;
