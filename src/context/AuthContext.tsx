import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';

export interface AppUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string | null;
  role: 'user' | 'admin';
  xp: number;
  coins: number;
  level: number;
  streak: number;
  gamesPlayed: number;
  completedPuzzles: number;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: (user: string, pass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUserStats: (gainedXp: number, gainedCoins: number, puzzleSolved: boolean) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'al_arabiya_admin_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check saved admin session or Firebase Auth state on mount
  useEffect(() => {
    // 1. Check local admin session
    const savedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        if (parsed && parsed.role === 'admin') {
          setUser(parsed);
          setLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    }

    // 2. Listen to Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      // If admin session is active in memory, don't overwrite
      const activeAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (activeAdmin) {
        setLoading(false);
        return;
      }

      if (fbUser) {
        await syncUserFromFirestore(fbUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const syncUserFromFirestore = async (fbUser: FirebaseUser) => {
    const userDocRef = doc(db, 'users', fbUser.uid);
    try {
      const snapshot = await getDoc(userDocRef);
      const isSystemAdmin = fbUser.email === 'razanzahron00@gmail.com';

      if (snapshot.exists()) {
        const data = snapshot.data();
        const appUser: AppUser = {
          uid: fbUser.uid,
          displayName: data.displayName || fbUser.displayName || 'Santri Arab',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL,
          role: isSystemAdmin ? 'admin' : (data.role || 'user'),
          xp: data.xp || 0,
          coins: data.coins || 0,
          level: data.level || 1,
          streak: data.streak || 1,
          gamesPlayed: data.gamesPlayed || 0,
          completedPuzzles: data.completedPuzzles || 0,
        };
        setUser(appUser);
      } else {
        // Create new user profile document in Firestore
        const newUser: AppUser = {
          uid: fbUser.uid,
          displayName: fbUser.displayName || 'Penjelajah Bahasa',
          email: fbUser.email || '',
          photoURL: fbUser.photoURL,
          role: isSystemAdmin ? 'admin' : 'user',
          xp: 0,
          coins: 20, // Welcome gift coins
          level: 1,
          streak: 1,
          gamesPlayed: 0,
          completedPuzzles: 0,
        };

        await setDoc(userDocRef, {
          ...newUser,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        setUser(newUser);
      }
    } catch (error) {
      console.warn('Firestore profile sync note:', error);
      // Fallback local representation if offline/rules block
      setUser({
        uid: fbUser.uid,
        displayName: fbUser.displayName || 'Santri Al-Arabiya',
        email: fbUser.email || '',
        photoURL: fbUser.photoURL,
        role: fbUser.email === 'razanzahron00@gmail.com' ? 'admin' : 'user',
        xp: 100,
        coins: 50,
        level: 1,
        streak: 1,
        gamesPlayed: 0,
        completedPuzzles: 0,
      });
    }
  };

  const loginWithGoogle = async () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserFromFirestore(result.user);
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  const loginAsAdmin = async (usernameInput: string, passwordInput: string) => {
    try {
      // Call backend API in api/index.ts
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const adminUser: AppUser = {
          uid: 'admin-super-id',
          displayName: 'Admin Razan (Pengelola)',
          email: 'admin@clarabiya.internal',
          photoURL: null,
          role: 'admin',
          xp: 9999,
          coins: 9999,
          level: 99,
          streak: 30,
          gamesPlayed: 100,
          completedPuzzles: 100,
        };

        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true, message: 'Selamat datang, Administrator!' };
      } else {
        return { success: false, message: data.message || 'Kredensial admin salah' };
      }
    } catch (error: any) {
      // Fallback local check if network issues
      if (usernameInput === 'admin' && passwordInput === 'Razanpintar') {
        const adminUser: AppUser = {
          uid: 'admin-super-id',
          displayName: 'Admin Razan (Pengelola)',
          email: 'admin@clarabiya.internal',
          photoURL: null,
          role: 'admin',
          xp: 9999,
          coins: 9999,
          level: 99,
          streak: 30,
          gamesPlayed: 100,
          completedPuzzles: 100,
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true, message: 'Selamat datang, Administrator!' };
      }
      return { success: false, message: error.message || 'Gagal terhubung ke server login' };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Error logging out:', err);
      setUser(null);
    }
  };

  const updateUserStats = async (gainedXp: number, gainedCoins: number, puzzleSolved: boolean) => {
    if (!user) return;

    const newXp = (user.xp || 0) + gainedXp;
    const newCoins = (user.coins || 0) + gainedCoins;
    const newLevel = Math.floor(newXp / 150) + 1;
    const newGamesPlayed = (user.gamesPlayed || 0) + 1;
    const newCompleted = puzzleSolved ? (user.completedPuzzles || 0) + 1 : (user.completedPuzzles || 0);

    const updatedUser: AppUser = {
      ...user,
      xp: newXp,
      coins: newCoins,
      level: newLevel,
      gamesPlayed: newGamesPlayed,
      completedPuzzles: newCompleted,
    };

    setUser(updatedUser);

    if (user.uid === 'admin-super-id') {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedUser));
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        xp: newXp,
        coins: newCoins,
        level: newLevel,
        gamesPlayed: newGamesPlayed,
        completedPuzzles: newCompleted,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not update stats in Firestore:', err);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.email === 'razanzahron00@gmail.com';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginAsAdmin,
        logout,
        updateUserStats,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
