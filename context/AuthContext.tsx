import { DEFAULT_AVATAR } from "@/constants/user";
import { auth, db } from "@/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthState = {
  user?: User | null;
  loading: boolean;
  logOut: () => void;
};

export const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  logOut: async () => { },
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            await setDoc(
              userRef,
              {
                uid: currentUser.uid,
                name: currentUser.displayName ?? "Unknown",
                email: currentUser.email ?? "",
                avatarUrl: currentUser.photoURL ?? DEFAULT_AVATAR,
                createdAt: new Date(),
                itemsActiveCount: 0,
                itemsFoundCount: 0,
                itemsReturnedCount: 0,
                savedItems: [],
              },
              { merge: true },
            );
          }
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking user existence:", error);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const logOut = async () => {
    try {
      // Keep the app in a loading state while Firebase clears the session,
      // so protected screens do not briefly render with a missing user.
      setLoading(true);
      await signOut(auth);
    } catch (error) {
      setLoading(false);
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
