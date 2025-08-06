import { createContext } from "react";
import type { UseThemeShape } from "./types";

const ThemeContext = createContext<UseThemeShape | undefined>(undefined);

export default ThemeContext;
