import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";

const AuthContext = createContext();

async function syncUserProfile(firebaseUser) {
  if (!firebaseUser) return null;

  const ref = doc(db, "users", firebaseUser.uid);
  const snap = await getDoc(ref);
  const now = Date.now();

  if (!snap.exists()) {
    const newProfile = {
      user_id: firebaseUser.uid,
      user_email: firebaseUser.email || "",
      full_name: firebaseUser.displayName || "",
      username: firebaseUser.displayName || "",
      avatar_url: firebaseUser.photoURL || "",
      role: "viewer",
      provider: firebaseUser.providerData?.[0]?.providerId || "google.com",
      created_at: now,
      updated_at: now,
    };

    await setDoc(ref, newProfile);
    return newProfile;
  }

  const existing = snap.data();

  const updatedProfile = {
    ...existing,
    user_id: firebaseUser.uid,
    user_email: firebaseUser.email || existing.user_email || "",
    full_name:
      existing.full_name || firebaseUser.displayName || existing.username || "",
    username:
      existing.username || firebaseUser.displayName || existing.full_name || "",
    avatar_url: firebaseUser.photoURL || existing.avatar_url || "",
    updated_at: now,
  };

  await setDoc(ref, updatedProfile, { merge: true });
  return updatedProfile;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [profile, setProfile] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoadingAuth(true);
      setAuthError(null);

      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setIsLoadingAuth(false);
          return;
        }

        setUser(firebaseUser);

        const syncedProfile = await syncUserProfile(firebaseUser);
        setProfile(syncedProfile);
      } catch (error) {
        console.error("Auth/profile sync error:", error);
        setAuthError(error);
        setUser(firebaseUser || null);
        setProfile(null);
      } finally {
        setIsLoadingAuth(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setAuthError(null);
    const result = await signInWithPopup(auth, googleProvider);
    const syncedProfile = await syncUserProfile(result.user);
    setUser(result.user);
    setProfile(syncedProfile);
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (!auth.currentUser) return null;
    const syncedProfile = await syncUserProfile(auth.currentUser);
    setProfile(syncedProfile);
    return syncedProfile;
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      isAuthenticated: !!user,
      isAdmin: profile?.role === "admin",
      isHost: profile?.role === "host",
      isLoadingAuth,
      authError,
      loginWithGoogle,
      logout,
      refreshProfile,
    }),
    [user, profile, isLoadingAuth, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
