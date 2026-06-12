import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Creates a new appointment. Tries Firestore first, falls back to localStorage
 * when Firebase isn't configured (placeholder keys).
 */
export async function createAppointment(data) {
  // Check if Firebase is using placeholder config
  const isPlaceholder =
    !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    typeof window !== 'undefined';

  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    return { id: docRef.id, ...data, status: 'pending' };
  } catch (err) {
    console.warn('Firestore unavailable, saving booking to localStorage:', err.message);

    // LocalStorage fallback
    const id = 'local_' + Date.now();
    const appointment = {
      id,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('killinkutz_appointments') || '[]');
    existing.push(appointment);
    localStorage.setItem('killinkutz_appointments', JSON.stringify(existing));

    return appointment;
  }
}
