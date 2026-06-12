"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Fetch user role and details from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
          } else {
            // Fallback if doc doesn't exist yet
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'user', name: firebaseUser.displayName || 'User' });
          }
        } else {
          // Check local storage fallback (for dev before keys are added)
          const savedUser = localStorage.getItem('killinkutz_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase Auth not initialized. Falling back to local auth.");
      const savedUser = localStorage.getItem('killinkutz_user');
      if (savedUser) setUser(JSON.parse(savedUser));
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = { uid: userCredential.user.uid, email, ...userDoc.data() };
      setUser(userData);
      return userData;
    } catch (error) {
      console.log("Firebase login failed, trying local fallback", error);
      // Local fallback
      if (email.toLowerCase() === 'admin@killinkutz.com' && password === 'admin123') {
        const adminUser = { name: 'Executive Admin', email: 'admin@killinkutz.com', role: 'admin', phone: '+91 76780 37492' };
        setUser(adminUser);
        localStorage.setItem('killinkutz_user', JSON.stringify(adminUser));
        return adminUser;
      }
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userRef = doc(db, 'users', result.user.uid);
    const userDoc = await getDoc(userRef);
    
    let userData;
    if (!userDoc.exists()) {
      userData = {
        name: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        role: 'user',
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, userData);
    } else {
      userData = userDoc.data();
    }
    
    setUser({ uid: result.user.uid, ...userData });
    return userData;
  };

  const signup = async (name, email, password, phone = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        name,
        email,
        phone,
        role: 'user',
        createdAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', userCredential.user.uid), userData);
      
      const fullUser = { uid: userCredential.user.uid, ...userData };
      setUser(fullUser);
      return fullUser;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch(e) {}
    setUser(null);
    localStorage.removeItem('killinkutz_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loginWithGoogle, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
