import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { HealthLog, Post, Comment, Resource, UserProfile, UserPrivateData, Appointment } from '../types';
import { getGuestLogs, getGuestPosts } from './guestData';

const isGuestId = (uid: string) => uid.startsWith('guest_') || (auth.currentUser?.isAnonymous);

// --- BACKEND BRIDGE CONFIGURATION ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

/**
 * Sends health data to the Python Backend for PCOD Risk Analysis
 */
async function triggerBackendAnalysis(userId: string, log: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        date: log.date,
        symptoms: log.symptoms || [],
        cycle_length: 0,
        mood: log.mood || 'neutral',
        flow: log.flow || 'medium',
        is_period_start: !!log.periodStart,
        notes: log.notes || ''
      }),
    });

    if (response.ok) {
      console.log('✅ PCOD Analysis successfully triggered on Python Backend');
    } else {
      console.warn('⚠️ Backend received log but returned an error');
    }
  } catch (error) {
    console.error('❌ Failed to connect to Python Backend (FastAPI). Ensure it is running on port 8000.');
  }
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- USER PROFILE ---
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (userId.startsWith('guest_')) return { id: userId, displayName: 'Guest Sister', joinedAt: new Date().toISOString() };
  const path = `users/${userId}`;
  try {
    const d = await getDoc(doc(db, path));
    return d.exists() ? { id: d.id, ...d.data() } as UserProfile : null;
  } catch (error) {
    if (!auth.currentUser) return null;
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createUserProfile(userId: string, data: Omit<UserProfile, 'id'>) {
  if (userId.startsWith('guest_')) return;
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, path), { ...data, joinedAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  if (userId.startsWith('guest_')) return;
  const path = `users/${userId}`;
  try {
    await updateDoc(doc(db, path), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// --- HEALTH LOGS (FIREBASE + FASTAPI BRIDGE) ---
export async function getLogs(userId: string): Promise<HealthLog[]> {
  if (isGuestId(userId)) {
    return getGuestLogs();
  }
  if (!auth.currentUser) return [];
  const path = `users/${userId}/logs`;
  try {
    const q = query(collection(db, path), limit(100));
    const snapshot = await getDocs(q);
    const logs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as HealthLog));
    return logs.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveLog(userId: string, log: Omit<HealthLog, 'id' | 'createdAt'>) {
  if (isGuestId(userId)) return;
  const path = `users/${userId}/logs/${log.date}`;
  try {
    const docRef = doc(db, path);
    const existingDoc = await getDoc(docRef);

    // 1. Save to Firebase (Primary Storage)
    if (existingDoc.exists()) {
      const existingData = existingDoc.data();
      await setDoc(docRef, {
        ...log,
        createdAt: existingData.createdAt
      });
    } else {
      await setDoc(docRef, {
        ...log,
        createdAt: serverTimestamp()
      });
    }

    // 2. Trigger Python Backend (PCOD Risk Analysis)
    await triggerBackendAnalysis(userId, log);

  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- LEARNING RESOURCES ---
export async function getResources(): Promise<Resource[]> {
  if (!auth.currentUser && !localStorage.getItem('cura_guest_session')) return [];
  const path = 'resources';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Resource));
  } catch (error) {
    if (!auth.currentUser) return [];
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

// --- APPOINTMENTS ---
export async function getAppointments(userId: string): Promise<Appointment[]> {
  if (isGuestId(userId)) return [];
  if (!auth.currentUser) return [];
  const path = 'appointments';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'createdAt'>) {
  if (!auth.currentUser || auth.currentUser.isAnonymous) return;
  const path = 'appointments';
  try {
    await addDoc(collection(db, path), { ...data, createdAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateAppointmentStatus(appointmentId: string, status: 'confirmed' | 'cancelled') {
  if (!auth.currentUser || auth.currentUser.isAnonymous) return;
  const path = `appointments/${appointmentId}`;
  try {
    await updateDoc(doc(db, 'appointments', appointmentId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// --- COMMUNITY POSTS ---
export async function getPosts(): Promise<Post[]> {
  const isLocalGuest = localStorage.getItem('cura_guest_session');
  if (auth.currentUser?.isAnonymous || (!auth.currentUser && isLocalGuest)) {
    return getGuestPosts();
  }
  if (!auth.currentUser) return [];

  const path = 'posts';
  try {
    const q = query(collection(db, path), orderBy('createdAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Post));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function createPost(data: Omit<Post, 'id' | 'createdAt' | 'likesCount'>) {
  const path = 'posts';
  try {
    const newDoc = doc(collection(db, path));
    await setDoc(newDoc, { ...data, likesCount: 0, createdAt: serverTimestamp() });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}