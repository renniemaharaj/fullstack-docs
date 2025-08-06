export type Theme = "light" | "dark";

export type Override = Theme | null;

export type UseThemeShape = {
  theme: "light" | "dark" | "inherit";
  specifyTheme: (theme: "light" | "dark" | "system") => void;
  usesSystemTheme: boolean;
};
