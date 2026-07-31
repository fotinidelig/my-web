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

export type SkillCategory =
  | 'programming'
  | 'ai'
  | 'cv'
  | 'tool'
  | 'web'
  | 'robotics'
  | 'data-viz'
  | 'design';

export type Skill = {
  name: string;
  level: number;
  category?: SkillCategory[];
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




