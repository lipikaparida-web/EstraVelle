import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { 
  getAppointments, 
  createAppointment, 
  updateAppointmentStatus 
} from '../services/db';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  Stethoscope, 
  Carrot, 
  Brain, 
  Star, 
  Globe, 
  Award, 
  Quote,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  History,
  Clock3
} from 'lucide-react';
import { format, addDays, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isAfter, isBefore } from 'date-fns';
import { cn } from '../lib/utils';
import { Doctor, Appointment } from '../types';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Gynecology',
    experience: '12 years',
    rating: 4.9,
    bio: 'Specializing in PCOS management and reproductive health with a holistic approach to long-term wellness.',
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=400',
    availability: ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'],
    affiliations: [
      'American Board of Obstetrics and Gynecology',
      'Clinical Faculty at NYU Langone Health',
      'North American Menopause Society (NAMS)'
    ],
    website: 'https://drjenkinshealth.com',
    testimonials: [
      { author: 'Elena T.', text: 'Dr. Jenkins truly listened to my concerns about PCOS. Her plan was practical and effective.', rating: 5 },
      { author: 'Maria G.', text: 'The most thorough gynecologist I have ever seen. Highly recommend.', rating: 5 }
    ]
  },
  {
    id: 'd2',
    name: 'Dr. Maya Patel',
    specialty: 'Nutrition',
    experience: '8 years',
    rating: 4.8,
    bio: 'Expert in hormonal-balancing diets and plant-based nutrition designed specifically for women with PCOD.',
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    availability: ['11:00 AM', '01:00 PM', '03:30 PM'],
    affiliations: [
      'Academy of Nutrition and Dietetics',
      'Consultant for Womens Health Magazine',
      'Integrative and Functional Nutrition Academy'
    ],
    website: 'https://mayanutrition.care',
    testimonials: [
      { author: 'Sarah K.', text: 'Maya helped me manage my insulin resistance through food. It changed my life.', rating: 5 },
      { author: 'Priya S.', text: 'So knowledgeable and supportive. The recipes are actually delicious!', rating: 4 }
    ]
  },
  {
    id: 'd3',
    name: 'Dr. Elena Rodriguez',
    specialty: 'Psychology',
    experience: '15 years',
    rating: 5.0,
    bio: 'Focusing on the emotional impact of chronic health conditions, hormonal changes, and medical anxiety.',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    availability: ['08:30 AM', '12:00 PM', '05:00 PM'],
    affiliations: [
      'American Psychological Association',
      'Director at Harmony Wellness Center',
      'Society for Health Psychology'
    ],
    website: 'https://elenarodriguez.com',
    testimonials: [
      { author: 'Jessica L.', text: 'Dr. Rodriguez helped me navigate the depression associated with my diagnosis.', rating: 5 },
      { author: 'Ananya R.', text: 'A compassionate therapist who truly understands the female endocrine system.', rating: 5 }
    ]
  }
];

export default function Appointments() {
  const { user, isGuest } = useAuth();
  const [filter, setFilter] = useState<'All' | 'Gynecology' | 'Nutrition' | 'Psychology'>('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    if (!user) return;
    const fetched = await getAppointments(user.uid);
    // Sort in memory: newest first
    fetched.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
    setMyAppointments(fetched);
  };

  const handleCancel = async (id: string) => {
    try {
      await updateAppointmentStatus(id, 'cancelled');
      await fetchMyAppointments();
      setCancellingId(null);
      setCancelSuccess(true);
      setTimeout(() => setCancelSuccess(false), 3000);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const handleBook = async () => {
    if (!selectedDoctor || !selectedTime || !user) return;
    if (isGuest) {
      alert("Guest Mode: Booking is simulated and will not be saved. Sign in to book real consultations. 👩‍⚕️");
      return;
    }
    setIsBooking(true);
    try {
      await createAppointment({
        userId: user.uid,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'confirmed'
      });
      setBookingSuccess(true);
      fetchMyAppointments();
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedDoctor(null);
        setSelectedTime(null);
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  };

  const filteredDoctors = filter === 'All' 
    ? MOCK_DOCTORS 
    : MOCK_DOCTORS.filter(d => d.specialty === filter);

  const now = new Date();
  const upcoming = myAppointments.filter(a => a.status === 'confirmed' && isAfter(new Date(a.date + ' ' + a.time), now));
  const past = myAppointments.filter(a => a.status === 'cancelled' || (a.status === 'confirmed' && isBefore(new Date(a.date + ' ' + a.time), now)));

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-700 italic">Specialist Care</h2>
          <p className="text-slate-500 mt-2 italic">Connect with experts who understand your journey. 👩‍⚕️</p>
        </div>
        
        <div className="flex bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-soft-pink/30">
          {['All', 'Gynecology', 'Nutrition', 'Psychology'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase transition-all",
                filter === cat ? "bg-[#C8A2C8] text-white shadow-md" : "text-slate-400 hover:text-serenity-purple"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Doctor List */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDoctors.map((doc, i) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="card-vibrant bg-white group hover:-translate-y-2 cursor-pointer flex flex-col items-center text-center p-8"
              onClick={() => setSelectedDoctor(doc)}
            >
              <div className="w-24 h-24 rounded-[2.5rem] overflow-hidden mb-6 border-4 border-[#F5E6DA] p-1 shadow-inner relative">
                <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover rounded-[2.2rem]" />
                <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm text-amber-400">
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
              <div className="space-y-1 mb-4">
                <div className="flex items-center justify-center gap-2 text-serenity-purple font-serif font-bold italic text-lg leading-none">
                  {doc.specialty === 'Gynecology' && <Stethoscope size={16} />}
                  {doc.specialty === 'Nutrition' && <Carrot size={16} />}
                  {doc.specialty === 'Psychology' && <Brain size={16} />}
                  {doc.name}
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{doc.specialty} • {doc.experience}</p>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed italic line-clamp-2 mb-6">
                "{doc.bio}"
              </p>
              <div className="w-full py-3.5 bg-lavender/10 text-serenity-purple border border-lavender/30 rounded-2xl text-xs font-bold uppercase tracking-widest group-hover:bg-serenity-purple group-hover:text-white transition-all text-center">
                Book Consultation
              </div>
            </motion.div>
          ))}
        </div>

        {/* My Appointments Sections */}
        <div className="lg:col-span-12 space-y-10">
          {/* Upcoming */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
                <Clock3 size={20} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-700 italic">Upcoming Visits</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.length > 0 ? (
                upcoming.map((app) => (
                  <motion.div 
                    layout
                    key={app.id} 
                    className="p-6 bg-white rounded-[2.5rem] border border-soft-pink/20 shadow-sm flex items-center gap-4 group hover:border-soft-pink/40 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-lavender/10 to-transparent -mr-8 -mt-8 rounded-full" />
                    <div className="w-14 h-14 bg-lavender/20 rounded-[1.25rem] flex flex-col items-center justify-center text-serenity-purple shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5">{format(parseISO(app.date), 'MMM')}</span>
                      <span className="text-xl font-serif font-bold leading-none">{format(parseISO(app.date), 'dd')}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-700 truncate">{app.doctorName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.time}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="px-2 py-0.5 bg-green-50 text-green-500 text-[9px] font-bold rounded-lg uppercase tracking-widest border border-green-100">
                        Confirmed
                      </span>
                      <button 
                        onClick={() => setCancellingId(app.id)}
                        className="text-[9px] text-slate-300 hover:text-red-400 font-bold uppercase tracking-widest transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="lg:col-span-3 py-16 text-center border-2 border-dashed border-soft-pink/10 rounded-[3rem] bg-white/40">
                  <p className="text-slate-400 italic text-sm">No upcoming visits. Book one with our experts! 🌿</p>
                </div>
              )}
            </div>
          </div>

          {/* Past/Cancelled */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <History size={20} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-700 italic">Care History</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.length > 0 ? (
                past.map((app) => (
                  <div key={app.id} className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex items-center gap-4 opacity-75 grayscale hover:grayscale-0 transition-all">
                    <div className="w-14 h-14 bg-slate-100 rounded-[1.25rem] flex flex-col items-center justify-center text-slate-400 shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-none mb-0.5">{format(parseISO(app.date), 'MMM')}</span>
                      <span className="text-xl font-serif font-bold leading-none">{format(parseISO(app.date), 'dd')}</span>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-bold text-slate-500 truncate">{app.doctorName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.time}</p>
                    </div>
                    <div>
                      <span className={cn(
                        "px-2 py-0.5 text-[9px] font-bold rounded-lg uppercase tracking-widest border",
                        app.status === 'cancelled' ? "bg-red-50 text-red-400 border-red-100" : "bg-slate-100 text-slate-500 border-slate-200"
                      )}>
                        {app.status === 'cancelled' ? 'Cancelled' : 'Completed'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="lg:col-span-3 py-12 text-center text-slate-300 italic text-sm">
                  No previous records found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Notifications */}
      <AnimatePresence>
        {cancelSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 z-[100]"
          >
            <CheckCircle2 className="text-green-400" size={20} />
            <span className="text-sm font-bold tracking-wide italic">Visit cancelled successfully. 🌿</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {cancellingId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setCancellingId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[3rem] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-700 mb-2 italic">Cancel Invitation?</h3>
              <p className="text-sm text-slate-500 mb-10 leading-relaxed italic">
                Are you sure? Your specialist is preparing for your journey. This action is permanent. 🌸
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => handleCancel(cancellingId)}
                  className="w-full py-5 bg-red-500 text-white rounded-2xl font-bold shadow-xl shadow-red-100 hover:bg-red-600 transition-all font-serif italic"
                >
                  Yes, Cancel My Visit
                </button>
                <button
                  onClick={() => setCancellingId(null)}
                  className="w-full py-5 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all uppercase tracking-widest text-[10px]"
                >
                  Keep My Appointment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isBooking && setSelectedDoctor(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <button 
                onClick={() => !isBooking && setSelectedDoctor(null)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-serenity-purple transition-all"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="w-full md:w-48 h-48 rounded-[2rem] overflow-hidden shrink-0 shadow-lg">
                  <img src={selectedDoctor.imageUrl} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-3xl font-serif font-bold text-slate-700 italic leading-none">{selectedDoctor.name}</h4>
                    <p className="text-sm text-serenity-purple font-bold uppercase tracking-widest mt-2">{selectedDoctor.specialty} Specialist</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-500 text-sm italic">
                    <span className="flex items-center gap-1"><Award size={16} /> {selectedDoctor.experience} Exp</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">< Star size={16} fill="currentColor" /> {selectedDoctor.rating}</span>
                    {selectedDoctor.website && (
                      <a href={selectedDoctor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-400 hover:underline">
                        <Globe size={16} /> Website
                      </a>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed text-sm">
                    {selectedDoctor.bio}
                  </p>
                </div>
              </div>

              {!bookingSuccess ? (
                <div className="flex flex-col gap-8 md:flex-row flex-1 overflow-hidden">
                  <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                    
                    {/* Doctor Details Toggles */}
                    <div className="space-y-4">
                      {selectedDoctor.affiliations && (
                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-soft-pink/10">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-2 block">Professional Affiliations</label>
                          <ul className="space-y-1">
                            {selectedDoctor.affiliations.map((aff, i) => (
                              <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600 italic">
                                <CheckCircle2 size={12} className="text-serenity-purple shrink-0 mt-0.5" />
                                {aff}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedDoctor.testimonials && (
                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-soft-pink/10">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 block">Patient Feedback</label>
                          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {selectedDoctor.testimonials.map((t, i) => (
                              <div key={i} className="min-w-[200px] p-3 bg-white rounded-xl border border-lavender/10 relative">
                                <p className="text-[10px] text-slate-600 italic line-clamp-3">"{t.text}"</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-[9px] font-bold text-slate-400">— {t.author}</span>
                                  <div className="flex gap-0.5 text-amber-400">
                                    {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={8} fill="currentColor" />)}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Advanced Calendar View */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Select Date</label>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedDate(subMonths(selectedDate, 1))}
                            className="p-1 hover:bg-lavender/10 rounded-full text-slate-400 hover:text-serenity-purple"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <span className="text-xs font-bold text-slate-700 min-w-[100px] text-center">
                            {format(selectedDate, 'MMMM yyyy')}
                          </span>
                          <button 
                            onClick={() => setSelectedDate(addMonths(selectedDate, 1))}
                            className="p-1 hover:bg-lavender/10 rounded-full text-slate-400 hover:text-serenity-purple"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center bg-slate-50/50 p-2 rounded-2xl border border-soft-pink/10">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                          <div key={d} className="text-[8px] font-bold text-slate-300 py-1">{d}</div>
                        ))}
                        {Array.from({ length: startOfMonth(selectedDate).getDay() }).map((_, i) => (
                          <div key={`empty-${i}`} />
                        ))}
                        {eachDayOfInterval({
                          start: startOfMonth(selectedDate),
                          end: endOfMonth(selectedDate)
                        }).map(day => {
                          const isSelected = isSameDay(day, selectedDate);
                          const isPast = day < new Date(new Date().setHours(0,0,0,0));
                          const isToday = isSameDay(day, new Date());
                          return (
                            <button
                              key={day.toString()}
                              disabled={isPast}
                              onClick={() => setSelectedDate(day)}
                              className={cn(
                                "aspect-square flex flex-col items-center justify-center text-[11px] rounded-xl transition-all relative",
                                isSelected ? "bg-serenity-purple text-white shadow-md font-bold" : "hover:bg-lavender/10 text-slate-600",
                                isToday && !isSelected && "ring-1 ring-serenity-purple/30",
                                isPast && "opacity-20 cursor-not-allowed grayscale"
                              )}
                            >
                              {format(day, 'd')}
                              {!isPast && (
                                <div className={cn(
                                  "w-1 h-1 rounded-full mt-0.5",
                                  isSelected ? "bg-white" : "bg-green-400"
                                )} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Available Times */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block">Available Times</label>
                        <span className="text-[10px] text-green-500 font-bold bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          {selectedDoctor.availability.length} Slots Available
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedDoctor.availability.map(time => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={cn(
                              "py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2",
                              selectedTime === time ? "bg-lavender text-serenity-purple border-serenity-purple shadow-md" : "bg-white border-soft-pink/20 text-slate-500 hover:border-serenity-purple"
                            )}
                          >
                            <Clock size={14} />
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="md:w-64 border-t md:border-t-0 md:border-l border-soft-pink/10 pt-6 md:pt-0 md:pl-8 flex flex-col justify-between">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-3 block">Summary</label>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                            <Calendar size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Date</p>
                            <p className="text-sm font-bold text-slate-700">{format(selectedDate, 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                            <Clock size={14} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Time</p>
                            <p className="text-sm font-bold text-slate-700">{selectedTime || 'Select Time'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 space-y-4">
                      <div className="p-4 bg-lavender/5 rounded-2xl border border-lavender/10">
                        <p className="text-[10px] text-slate-400 italic text-center">You'll receive a confirmation link once booked. 🌿</p>
                      </div>
                      <button
                        onClick={handleBook}
                        disabled={!selectedTime || isBooking}
                        className="w-full py-4 bg-serenity-purple text-white rounded-2xl font-bold shadow-xl shadow-lavender/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isBooking ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <CheckCircle2 size={18} />}
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-serif font-bold text-slate-700 italic">Booking Confirmed!</h4>
                    <p className="text-sm text-slate-500 italic">Check your history for consultation details. 🌿</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
