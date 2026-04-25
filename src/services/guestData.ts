import { HealthLog, Post, Mood } from '../types';
import { subDays, format } from 'date-fns';

export function getGuestLogs(): HealthLog[] {
  const logs: HealthLog[] = [];
  const moods: Mood[] = ['happy', 'low', 'anxious', 'irritated'];
  const symptomsList = ['Bloating', 'Cramps', 'Headache', 'Fatigue', 'Acne', 'Mood Swings', 'Breast Tenderness'];

  for (let i = 0; i < 60; i++) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayOfCycle = i % 28;

    logs.push({
      id: `guest-log-${i}`,
      date: dateStr,
      mood: moods[Math.floor(Math.random() * moods.length)],
      symptoms: Array.from({ length: Math.floor(Math.random() * 3) }, () => symptomsList[Math.floor(Math.random() * symptomsList.length)]),
      sleep: 5 + Math.floor(Math.random() * 5),
      water: 4 + Math.floor(Math.random() * 8),
      exercise: Math.floor(Math.random() * 60),
      periodStart: dayOfCycle === 0,
      periodEnd: dayOfCycle === 4,
      notes: `Sample guest note for day ${i}`,
      createdAt: date.toISOString()
    });
  }
  return logs;
}

export function getGuestPosts(): Post[] {
  const posts: Post[] = [];
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
    posts.push({
      id: `guest-post-${i}`,
      title: postTitles[i],
      content: "This is a pseudo post generated for testing purposes. It contains some placeholder content to showcase how the community forum looks in guest mode.",
      authorId: 'guest-user',
      authorName: 'Guest Sister',
      isAnonymous: Math.random() > 0.5,
      tags: ['Testing', 'Health', 'Community'],
      likesCount: Math.floor(Math.random() * 50),
      createdAt: subDays(new Date(), i).toISOString()
    });
  }
  return posts;
}
