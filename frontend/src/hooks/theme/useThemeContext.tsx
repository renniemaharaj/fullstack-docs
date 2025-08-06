import { useContext } from "react";
import type { UseThemeShape } from "./types";
import ThemeContext from "./context";

const useThemeContext = (): UseThemeShape => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within a ThemeProvider");
  return context;
};

export default useThemeContext;
