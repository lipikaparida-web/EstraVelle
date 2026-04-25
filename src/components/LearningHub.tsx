import { useState, useEffect } from 'react';
import { getResources } from '../services/db';
import { Resource } from '../types';
import { ExternalLink, BookOpen, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Understanding PCOS Symptoms',
    description: 'A comprehensive guide from the Mayo Clinic on identifying and managing common PCOS symptoms.',
    url: 'https://www.mayoclinic.org/diseases-conditions/pcos/symptoms-causes/syc-20353439',
    source: 'Mayo Clinic',
    category: 'Medical',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-217359f42f8c?w=400&q=80'
  },
  {
    id: '2',
    title: 'Diet & Insulin Resistance',
    description: 'Healthline explores how targeted nutrition can help balance hormones and improve energy levels.',
    url: 'https://www.healthline.com/health/pcos-diet',
    source: 'Healthline',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80'
  },
  {
    id: '3',
    title: 'Mindfulness & Cortisol',
    description: 'Research indicates a strong link between stress management and cycle regularity. Find peace today.',
    url: 'https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome',
    source: 'WHO',
    category: 'Emotional',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80'
  },
  {
    id: '4',
    title: 'The Sleep-Hormone Connection',
    description: 'Deep dive into why rest is the most powerful tool for hormonal repair and cognitive clarity.',
    url: 'https://www.sleepfoundation.org/physical-health/pcos-and-sleep',
    source: 'Sleep Foundation',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1511295742364-917e7033190d?w=400&q=80'
  },
  {
    id: '5',
    title: 'Yoga for Pelvic Health',
    description: 'Specific sequences designed to improve blood flow and reduce inflammation in the reproductive system.',
    url: 'https://www.yogajournal.com/lifestyle/health/yoga-for-pcos/',
    source: 'Yoga Journal',
    category: 'Lifestyle',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80'
  },
  {
    id: '6',
    title: 'Fertility & Empowered Planning',
    description: 'Understanding ovulation tracking and reproductive options when managing PCOS symptoms.',
    url: 'https://www.reproductivefacts.org/news-and-publications/patient-fact-sheets-and-booklets/documents/fact-sheets-and-info-booklets/pcos-and-fertility/',
    source: 'ASRM',
    category: 'Medical',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80'
  },
  {
    id: '7',
    title: 'Gut Health & Inflammation',
    description: 'The hidden link between your microbiome and androgen levels. Fix your gut, fix your skin.',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6447774/',
    source: 'PubMed',
    category: 'Medical',
    imageUrl: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&q=80'
  }
];

export default function LearningHub() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    // In a real app, fetch from DB
    setResources(MOCK_RESOURCES);
  }, []);

  const filteredResources = filter === 'All' 
    ? resources 
    : resources.filter(r => r.category === filter);

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 uppercase-labels">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-serif font-bold text-slate-700 italic">Learning Hub</h2>
          <p className="text-slate-500 mt-3 leading-relaxed italic">
            Curated knowledge from trusted medical authorities to help you understand your body better. 
            Science-backed care, delivered with empathy. 💖
          </p>
        </div>
        
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-soft-pink/30">
          {['All', 'Medical', 'Lifestyle', 'Emotional'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all ${
                filter === cat ? 'bg-[#C8A2C8] text-white shadow-md' : 'text-slate-400 hover:text-serenity-purple'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource, i) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group card-vibrant overflow-hidden flex flex-col h-full hover:-translate-y-2 p-0"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img 
                src={resource.imageUrl} 
                alt={resource.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-serenity-purple border border-soft-pink/30 shadow-sm">
                {resource.source}
              </div>
            </div>
            
            <div className="p-8 flex flex-col flex-1 space-y-4">
              <h3 className="text-xl font-serif font-bold text-slate-800 leading-tight italic">{resource.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1 italic">{resource.description}</p>
              
              <a 
                href={resource.url} 
                target="_blank" 
                rel="no-referrer"
                className="inline-flex items-center gap-2 text-serenity-purple font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all underline underline-offset-4 decoration-soft-pink"
              >
                Read Article <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verified Note */}
      <div className="mx-auto max-w-3xl text-center py-12 space-y-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-cura-purple shadow-sm border border-lavender/30">
          <BookOpen size={28} />
        </div>
        <h4 className="text-xl font-serif text-gray-800 italic">Always Verified</h4>
        <p className="text-sm text-gray-500 leading-relaxed max-w-lg mx-auto italic">
          Every article in EstraVelle's Hub is peer-reviewed or comes from internationally recognized health organizations. 
          We believe in clarity over confusion.
        </p>
      </div>
    </div>
  );
}
