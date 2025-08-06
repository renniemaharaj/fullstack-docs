import { useState, useEffect, useCallback } from "react";
import type { Override, Theme } from "./types";

const useThemePreference = () => {
  const detectOverride = (): Override => {
    const override = localStorage.getItem("theme");
    return override === "light" || override === "dark" ? override : null;
  };

  const [theme, setTheme] = useState<Theme>(() => {
    const override = detectOverride();
    if (override) return override;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [override, setOverride] = useState<Override>(() => detectOverride());

  const updateThemeState = useCallback(() => {
    const currentOverride = detectOverride();
    setOverride(currentOverride);

    if (currentOverride) {
      setTheme(currentOverride);
    } else {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setTheme(mediaQuery.matches ? "dark" : "light");
    }
  }, []);

  const specifyTheme = useCallback(
    (value: Theme | "system") => {
      if (value === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", value);
      }
      updateThemeState();
    },
    [updateThemeState]
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (!detectOverride()) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "theme") {
        updateThemeState();
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [updateThemeState]);

  return {
    theme,
    specifyTheme,
    usesSystemTheme: override === null,
  };
};

export default useThemePreference;
