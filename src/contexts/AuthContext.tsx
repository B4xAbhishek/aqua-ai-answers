import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastVerifiedUid, setLastVerifiedUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user && user.uid !== lastVerifiedUid) {
        try {
          const token = await user.getIdToken();
          await axios.post("http://localhost:8000/api/auth/verify", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setLastVerifiedUid(user.uid);
        } catch (err) {
          console.error("Failed to verify user with backend:", err);
        }
      }
    });

    return unsubscribe;
  }, [lastVerifiedUid]);

  async function signup(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function logout() {
    await signOut(auth);
  }

  const value = {
    currentUser,
    loading,
    login,
    signup,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
