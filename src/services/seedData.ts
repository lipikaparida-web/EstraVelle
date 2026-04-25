import { saveLog, createPost } from './db';
import { subDays, format } from 'date-fns';
import { Mood } from '../types';

export async function seedData(userId: string, userName: string) {
  console.log('Starting seeding data for user:', userId);

  // 1. Seed 40 Health Logs (past 40 days)
  const moods: Mood[] = ['happy', 'low', 'anxious', 'irritated'];
  const symptomsList = ['Bloating', 'Cramps', 'Headache', 'Fatigue', 'Acne', 'Mood Swings', 'Breast Tenderness'];
  
  for (let i = 0; i < 40; i++) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Cycle simulation: assume period every 28 days for 5 days
    const dayOfCycle = i % 28;
    const isPeriod = dayOfCycle >= 0 && dayOfCycle < 5;

    const log = {
      date: dateStr,
      mood: moods[Math.floor(Math.random() * moods.length)],
      symptoms: Array.from({ length: Math.floor(Math.random() * 3) }, () => symptomsList[Math.floor(Math.random() * symptomsList.length)]),
      sleep: 5 + Math.floor(Math.random() * 5),
      water: 4 + Math.floor(Math.random() * 8),
      exercise: Math.floor(Math.random() * 60),
      periodStart: dayOfCycle === 0,
      periodEnd: dayOfCycle === 4,
      notes: `Sample note for day ${i}`
    };

    await saveLog(userId, log);
  }

  // 2. Seed 10 Community Posts
  const postTitles = [
    "How to manage PCOS cravings?",
    "Managing fatigue naturally",
    "Best supplements for hormonal balance?",
    "Tracking my cycle for 3 months now",
    "Feeling overwhelmed but hopeful",
    "New diet tips for insulin resistance",
    "Anyone else experienced sudden acne?",
    "Morning routine that changed everything",
    "Yoga poses for period pain",
    "Sharing my win today!"
  ];

  for (let i = 0; i < 10; i++) {
    await createPost({
      title: postTitles[i],
      content: "This is a pseudo post generated for testing purposes. It contains some placeholder content to showcase how the community forum looks with multiple active discussions.",
      authorId: userId,
      authorName: userName,
      isAnonymous: Math.random() > 0.5,
      tags: ['Testing', 'Health', 'Community']
    });
  }

  console.log('Seeding completed successfully!');
}
