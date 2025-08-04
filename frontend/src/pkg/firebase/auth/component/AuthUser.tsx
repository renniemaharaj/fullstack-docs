import { useCallback } from "react";
import { GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";

import { Button } from "@primer/react";
import { auth } from "../../firebase";
import Card from "./user/Card";
import useUserLikelySignedIn from "../hooks/useUserLikelySignedIn";

const AuthUser = ({ variant = "button" }: { variant?: "image" | "button" }) => {
  const { user } = useUserLikelySignedIn();

  const handleSignIn = useCallback(async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return variant === "image" ? (
    <Card
      user={user}
      handleSignIn={handleSignIn}
      handleSignOut={handleSignOut}
    />
  ) : (
    <Button onClick={handleSignIn}>Sign In</Button>
  );
};

export default AuthUser;
