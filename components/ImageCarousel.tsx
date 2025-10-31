import React, { useState, useEffect } from 'react';
import { CarouselImage } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { generateImageFromPrompt } from '../services/geminiService';

interface ImageCarouselProps {
  images: CarouselImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const generate = async () => {
      if (!images || images.length === 0) return;
      setIsLoading(true);
      const prompt = images[currentIndex].prompt;
      const url = await generateImageFromPrompt(prompt);
      if (isMounted) {
        setCurrentImageUrl(url);
        setIsLoading(false);
      }
    };
    generate();
    return () => { isMounted = false; };
  }, [currentIndex, images]);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="max-w-xl mx-auto relative group my-4">
      <div className="w-full h-64 rounded-2xl shadow-lg border-2 border-k-yellow overflow-hidden">
        {isLoading ? (
          <div className="w-full h-full bg-gray-700 animate-pulse flex items-center justify-center">
            <p className="text-k-yellow">Generating image...</p>
          </div>
        ) : currentImageUrl ? (
          <img src={currentImageUrl} alt={images[currentIndex].alt} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
             <p className="text-red-500">Image failed to load.</p>
          </div>
        )}
      </div>
      
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 left-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer" onClick={prevSlide}>
        <ChevronLeftIcon className="w-6 h-6" />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-1/2 -translate-y-1/2 right-5 text-2xl rounded-full p-2 bg-black/40 text-white cursor-pointer" onClick={nextSlide}>
        <ChevronRightIcon className="w-6 h-6" />
      </div>

      <div className="flex top-4 justify-center py-2">
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => setCurrentIndex(slideIndex)}
            className={`text-2xl cursor-pointer mx-1 ${currentIndex === slideIndex ? 'text-k-yellow' : 'text-gray-400'}`}
          >
            ●
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;