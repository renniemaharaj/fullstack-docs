import { useState } from "react";

export function useAnimateCopy(duration = 1000) {
  const [animating, setAnimating] = useState(false);

  const animateCopy = () => {
    setAnimating(true);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setAnimating(false);
        resolve();
      }, duration);
    });
  };

  const animationClass = animating
    ? "absolute !w-full !h-full !z-10 animate-copy"
    : "";

  return { animateCopy, animationClass };
}
