import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
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
  logOut: async () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
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
