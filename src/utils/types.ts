export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  links?: { demo?: string; repo?: string };
};

export type Skill = {
  name: string;
  level: number; // 0-100
  category?: 'programming' | 'framework' | 'tool' | 'ai';
  years?: number;
};

export type GalleryItem = {
  src: string;
  alt: string;
};




