export type Persona = 'keladi_chennamma' | 'nayaka' | 'karnataka' | 'kittur_chennamma' | 'rayanna' | 'halagali_bedaru' | 'onake_obavva' | 'historian';

export type Language = 'kn' | 'en';

export type View = 'welcome' | 'chat';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  persona: Persona | null;
}

export interface CarouselImage {
  prompt: string;
  alt: string;
}