<div align="center">
  <h1>🌙 EstraVelle</h1>
  <p><strong>Your hormonal health sanctuary.</strong></p>
  <p>A comprehensive women's health platform built for PCOD/PCOS management — combining cycle tracking, AI-powered guidance, symptom analytics, specialist consultations, and a safe community space.</p>
</div>

---

## Overview

EstraVelle is a full-stack hormonal health management platform designed specifically for women navigating PCOD, PCOS, and cycle-related wellness. It goes beyond basic period tracking — EstraVelle understands where you are in your cycle, what your body is telling you, and how to support you through every phase.

Built with a warm, empathetic design language and a privacy-first architecture, EstraVelle is as much about emotional safety as it is about health data.

---

## Features

### 🏠 Dashboard
A personalised home screen that shows your current cycle phase (Follicular, Ovulatory, Luteal, Menstrual), last and expected period dates, average cycle length, ovulation date, weekly log progress, and a live Symptom & Mood Trends chart — all at a glance.

### 📅 Daily Log
A calendar-based check-in system where users log their current mood (Happy, Low, Anxious, Irritated), physical symptoms (Acne, Bloating, Fatigue, Cravings, Cramps, Headache, Mood Swings), sleep hours, water intake, and period flow. Each day's data feeds directly into analytics and AI insights.

### 🤖 Ask AI — Ask EstraVelle
A conversational AI health companion powered by the Gemini API. Responds with empathy and cycle-awareness — understanding context like "I'm feeling bloated" in the context of your current phase, and offering actionable, supportive guidance. Clearly positioned as a companion, not a clinical tool.

### 👩‍⚕️ Consult — Specialist Care
Browse and book consultations with specialists across Gynaecology, Nutrition, and Psychology. Each specialist profile includes their specialisation, years of experience, and a personal statement. Upcoming visits and care history are tracked within the platform.

### 📊 Health Report
AI-generated insights from your 30-day health signature. Includes a log overview (total check-ins, avg sleep, avg hydration), hormonal pattern analysis for PCOD management, and a Symptom Insights breakdown showing how lifestyle factors correlate with physical symptoms across categories like Acne, Headache, Cramps, Breast Tenderness, and Mood Swings.

### 📖 History
A chronological timeline of every logged day — showing period status, sleep duration, mood level, symptoms, and personal notes. A complete, readable record of your health journey.

### 📚 Library — Learning Hub
Curated articles from trusted medical authorities (Mayo Clinic, Healthline, WHO, Sleep Foundation, Yoga Journal, ASRM, PubMed) covering PCOS symptoms, diet and insulin resistance, mindfulness and cortisol, sleep-hormone connections, yoga for pelvic health, fertility planning, and gut health. Filterable by Medical, Lifestyle, and Emotional categories.

### 👥 Community — Safe-Space
An encrypted community forum for peer discussions and shared stories. Features Sisterhood Guidelines, active encryption indicators, and community stats. Posts are protected by default. Designed as a judgment-free space specifically for women managing hormonal conditions.

### 👤 Profile — Personal Sanctuary
User identity management alongside a **Hormonal Rhythm** section (birth date, avg cycle length) and **Healing Intentions** (personal journey goals). Includes a strong privacy commitment: *"Your sovereignty is absolute. Your data is encrypted and used solely to personalise your experience. We never monetise your health history."*

### ⚙️ Settings — Core Wisdom
Personalisation controls for visual theme (Serenity Light / Dark), primary language, measurement units (Metric/Imperial), cycle tracking mode, notification preferences, and privacy settings. Includes a Deep Data Export feature — download your full health history as PDF or CSV for your healthcare provider.

### 🌍 Multilingual Support
Full i18n support with language options including English, Hindi, Kannada, Tamil, Marathi, Punjabi, and Telugu — making the platform accessible across India.

---

## Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React 18 + TypeScript | Type-safe UI with zero `any` approach |
| Vite | Fast builds and HMR |
| Tailwind CSS | Utility-first responsive styling |
| React Context API | Auth and Theme global state |
| i18n | Multi-lingual localization (7 Indian languages) |

### Backend & Infrastructure
| Technology | Role |
|---|---|
| Python (`main.py`) | API backend and server logic |
| Firebase & Firestore | Authentication and real-time document storage |
| Gemini API | Conversational AI health companion |
| Firestore Security Rules | Token-validated, per-user data isolation |

---

## Project Structure

```
EstraVelle/
├── backend/
│   ├── main.py               # API server and route logic
│   └── requirements.txt
│
├── src/
│   ├── components/           # Dashboard, AIChatbot, DailyLog, Community, etc.
│   ├── context/              # AuthContext, ThemeContext
│   ├── lib/                  # Firebase initialisation, utilities
│   ├── services/             # geminiService, database layers
│   ├── types/                # TypeScript data models and interfaces
│   ├── App.tsx               # Routing and app composition
│   └── i18n.ts               # Localization configuration
│
├── firestore.rules           # Granular database access rules
├── security_spec.md          # Security architecture documentation
└── vite.config.ts            # Build configuration
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- Firebase CLI *(optional)*

### 1. Clone the repository
```bash
git clone https://github.com/your-username/estravelle.git
cd estravelle
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 3. Frontend setup
```bash
npm install
```

### 4. Environment configuration
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 5. Run the development server
```bash
npm run dev
```

Visit `http://localhost:5173`

---

## Privacy & Security

EstraVelle is built on a foundation of trust. Health data — especially hormonal and reproductive data — is deeply personal.

- **Firestore security rules** enforce strict per-user data isolation with token validation
- **Encryption active** on all community posts and health records
- **No data monetisation** — health history is never sold or used for advertising
- **Data portability** — users can export their full health history at any time as PDF or CSV
- All security requirements are documented in `security_spec.md`

---

## Target Users

EstraVelle is built for women — particularly those managing PCOD, PCOS, or simply wanting to understand their hormonal patterns with more clarity and compassion than generic period trackers offer.

---

## Built By

EstraVelle is an independent project built with care by:

- **Lipika Parida** 
- **Smruti Pragyan**

---

## Conclusion

EstraVelle started as a vision to give women — especially those navigating PCOD and PCOS — a platform that treats them with the empathy, intelligence, and privacy they deserve. Most health apps track data. EstraVelle is built to understand it, and to support the person behind it.

This is an active work in progress. We are currently in development and working toward scaling EstraVelle into a fully production-ready application — with deeper AI personalisation, real specialist integrations, and a wider community. The foundation is built. The mission is clear.

*Your hormonal health sanctuary — coming fully to life, one phase at a time.*

---
