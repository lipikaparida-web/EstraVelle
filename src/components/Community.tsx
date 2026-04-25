import { useState, useEffect } from 'react';
import { getPosts, createPost } from '../services/db';
import { Post } from '../types';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Heart, Share2, Plus, Sparkles, User, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';

export default function Community() {
  const { user, isGuest } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  const handleCreate = async () => {
    if (!user || !newTitle || !newContent) return;
    if (isGuest) {
      alert("Please sign in to share your story with the community. Guest posts are for preview only. 💜");
      return;
    }
    await createPost({
      title: newTitle,
      content: newContent,
      authorId: user.uid,
      authorName: isAnonymous ? 'Anonymous' : user.displayName || 'Sister',
      isAnonymous,
      tags: ['Daily Wins'] // Default tag for now
    });
    setNewTitle('');
    setNewContent('');
    setShowCreate(false);
    fetchPosts();
  };

  const formatPostDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      // Handle Firestore Timestamp
      if (typeof timestamp.toDate === 'function') {
        return formatDistanceToNow(timestamp.toDate()) + ' ago';
      }
      // Handle ISO string or JS Date
      return formatDistanceToNow(new Date(timestamp)) + ' ago';
    } catch (e) {
      return 'Recent';
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-700 italic tracking-tight">Community Safe-Space</h2>
          <p className="text-slate-500 italic flex items-center gap-2">
            <Sparkles size={16} className="text-serenity-purple" />
            A supportive circle for open hearts. 💜
          </p>
        </div>
        
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-cura-purple text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-lavender/40 flex items-center justify-center gap-2 hover:translate-y-[-2px] hover:shadow-2xl transition-all active:scale-95 group w-full md:w-auto"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Share Your Story
        </button>
      </header>

      {/* Search Bar - Enhanced */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search size={20} className="text-slate-400 group-focus-within:text-serenity-purple transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search discussions, advice, or shared stories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-soft-pink/20 rounded-[2rem] pl-14 pr-6 py-5 text-base focus:outline-none focus:ring-4 focus:ring-lavender/20 transition-all dark:text-slate-200 shadow-md placeholder:text-slate-300 placeholder:italic"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column - Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence>
            {showCreate && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="card-soft p-1 overflow-hidden bg-gradient-to-br from-lavender/30 to-soft-pink/30 border-2 border-white"
              >
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[1.8rem] space-y-6">
                  <input 
                    type="text" 
                    placeholder="Title of your post..." 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-2xl font-serif italic text-slate-800 dark:text-slate-100 bg-transparent border-none focus:outline-none placeholder:text-slate-300"
                  />
                  <textarea 
                    placeholder="Share your experience or ask for advice..." 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={6}
                    className="w-full bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-2xl resize-none focus:outline-none border border-slate-100 dark:border-slate-800 focus:border-lavender transition-all italic text-slate-700 dark:text-slate-300 leading-relaxed"
                  />
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100/50">
                    <button 
                      onClick={() => setIsAnonymous(!isAnonymous)}
                      className={`flex items-center gap-3 text-sm font-bold transition-all px-4 py-2 rounded-xl border ${isAnonymous ? 'text-cura-purple bg-lavender/10 border-lavender/30' : 'text-slate-400 bg-slate-50 border-slate-200'}`}
                    >
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${isAnonymous ? 'bg-cura-purple' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all ${isAnonymous ? 'translate-x-5' : ''}`} />
                      </div>
                      Post Anonymously
                    </button>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button onClick={() => setShowCreate(false)} className="flex-1 sm:flex-none px-8 py-3 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-xs tracking-widest">Cancel</button>
                      <button onClick={handleCreate} className="flex-1 sm:flex-none bg-cura-purple text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-lavender/30 hover:bg-serenity-purple transition-all active:scale-95">Publish</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            {filteredPosts.map((post, i) => (
              <motion.article 
                key={post.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-vibrant group p-8 md:p-10"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-soft-pink to-lavender flex items-center justify-center text-white border-2 border-white shadow-md">
                      <User size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 tracking-tight">{post.authorName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none mt-1.5">
                        {formatPostDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  {post.isAnonymous && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                      <ShieldCheck size={12} className="text-cura-purple" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protected</span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 italic mb-6 leading-tight group-hover:text-serenity-purple transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-8 italic mb-10 text-lg">
                  {post.content}
                </p>

                <div className="flex flex-wrap items-center gap-6 border-t border-slate-100 dark:border-slate-800/50 pt-8">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2.5 text-slate-400 hover:text-rose-500 transition-all text-xs font-bold uppercase tracking-widest group/btn"
                  >
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover/btn:bg-rose-50 dark:group-hover/btn:bg-rose-900/20 transition-all">
                      <motion.div
                        whileTap={{ scale: 1.4, rotate: -15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Heart size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </motion.div>
                    </div>
                    <span>{post.likesCount || 0}</span>
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2.5 text-slate-400 hover:text-serenity-purple transition-all text-xs font-bold uppercase tracking-widest group/btn"
                  >
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover/btn:bg-lavender/20 dark:group-hover/btn:bg-lavender/10 transition-all">
                      <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" />
                    </div>
                    <span>Respond</span>
                  </motion.button>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center gap-2.5 text-slate-400 hover:text-blue-500 transition-all text-xs font-bold uppercase tracking-widest group/btn sm:ml-2"
                  >
                    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover/btn:bg-blue-50 dark:group-hover/btn:bg-blue-900/20 transition-all">
                      <Share2 size={18} />
                    </div>
                  </motion.button>
                  
                  <div className="ml-auto flex flex-wrap gap-2">
                    {post.tags?.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em] border border-slate-100 dark:border-slate-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                <Sparkles size={48} className="mx-auto text-lavender/40 mb-6" />
                <h4 className="text-xl font-serif italic text-slate-400">No stories found matching your search...</h4>
                <p className="text-sm text-slate-300 mt-2">Why not share your own today?</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Guidelines & Stats */}
        <aside className="lg:col-span-4 space-y-6 sticky top-8">
          <div className="card-soft p-8 bg-gradient-to-br from-cura-purple/10 to-lavender/20 border-2 border-white shadow-xl">
            <h4 className="text-sm font-bold text-cura-purple uppercase tracking-[0.2em] mb-4">Sisterhood Guidelines</h4>
            <ul className="space-y-4">
              {[
                "We listen with empathy and without judgment.",
                "Sharing vulnerability is a strength here.",
                "Offer support, not unsolicited medical advice.",
                "Your privacy is our sacred priority."
              ].map((guide, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cura-purple shrink-0" />
                  {guide}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-soft p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-lavender/10 rounded-2xl text-serenity-purple border border-lavender/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Privacy First</h4>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Encryption Active</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed">
              Your identity is protected. We use advanced anonymization to ensure your health discussions remain truly private.
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-800 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-all" />
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-lavender mb-6">Community Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 italic">Active Sisters</span>
                <span className="text-lg font-bold">1,240</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 italic">Shared Stories</span>
                <span className="text-lg font-bold">8,512</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
              Join the Circle
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
