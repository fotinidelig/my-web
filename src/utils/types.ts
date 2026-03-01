export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  previewImage?: string; // Optional preview image for card background
  stack?: string[];
  links?: { demo?: string; repo?: string };
};

export type Skill = {
  name: string;
  level: number; // 0-100
  category?: 'programming' | 'ai' | 'cv' | 'tool' | 'web' | 'robotics';
  years?: number;
};

export type GalleryItem = {
  src: string;
  alt: string;
  location?: string; // Optional location metadata to help distinguish images
};

export type TimelineItem = {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  icon?: string; // logo/image URL
  iconText?: string; // fallback text/initials
};




