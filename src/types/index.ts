export interface UserProfile {
  id?: string;
  displayName: string;
  photoURL?: string;
  joinedAt: string;
  birthDate?: string;
  cycleLength?: number;
  intentions?: string;
}

export interface UserPrivateData {
  email: string;
  age?: number;
  weight?: number;
  cycleLength?: number;
}

export type Mood = 'happy' | 'low' | 'anxious' | 'irritated';

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  periodStart?: boolean;
  periodEnd?: boolean;
  mood?: Mood;
  symptoms: string[];
  sleep?: number;
  water?: number;
  exercise?: number;
  notes?: string;
  createdAt: any;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: 'Gynecology' | 'Nutrition' | 'Psychology';
  experience: string;
  rating: number;
  bio: string;
  imageUrl: string;
  availability: string[];
  affiliations?: string[];
  website?: string;
  testimonials?: {
    author: string;
    text: string;
    rating: number;
  }[];
}

export interface Appointment {
  id: string;
  userId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  category: string;
  imageUrl?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  isAnonymous: boolean;
  createdAt: any;
  likesCount: number;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: any;
}
