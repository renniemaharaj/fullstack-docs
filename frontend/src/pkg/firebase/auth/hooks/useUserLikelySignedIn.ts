import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase";

const useUserLikelySignedIn = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const tok = await firebaseUser.getIdToken();
        setToken(tok);
        return;
      }
      setToken("");
      setUser(null);
    });
    return () => unsub();
  }, []);

  return { token: token, user: user };
};
export default useUserLikelySignedIn;
