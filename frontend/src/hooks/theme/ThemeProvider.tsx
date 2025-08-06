import { type ReactNode } from "react";

import useThemePreference from "./useThemePreference";
import ThemeContext from "./context";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, specifyTheme, usesSystemTheme } = useThemePreference();

  return (
    <ThemeContext.Provider value={{ theme, specifyTheme, usesSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
