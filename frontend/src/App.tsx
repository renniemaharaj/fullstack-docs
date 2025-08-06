import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { AuthRouter } from "./pkg/firebase/auth/AuthRouter";
import { protectedRoutesFunc, publicRoutesFunc } from "./pages/page/routing";

import "@primer/primitives/dist/css/functional/themes/light.css";
import "@primer/primitives/dist/css/functional/themes/dark.css";
import { ThemeProvider, BaseStyles } from "@primer/react";
import "@primer/react-brand/lib/css/main.css";
import EBoundary from "./pages/page/views/EBoundary";

import { ThemeProvider as LocalThemeProvider } from "./hooks/theme/ThemeProvider";
import useThemeContext from "./hooks/theme/useThemeContext";

function App() {
  return (
    <LocalThemeProvider>
      <ErrorBoundary FallbackComponent={EBoundary}>
        <AppShell />
      </ErrorBoundary>
    </LocalThemeProvider>
  );
}

function AppShell() {
  const { theme } = useThemeContext();
  return (
    <ThemeProvider
      colorMode={
        ((theme === "dark" && "dark") ||
          (theme === "light" && "light") ||
          (theme === "inherit" && "auto")) as "dark" | "light" | "auto"
      }
    >
      <BaseStyles>
        <AppRoutes />
      </BaseStyles>
    </ThemeProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {publicRoutesFunc()}
      <Route element={<AuthRouter />}>{protectedRoutesFunc()}</Route>
    </Routes>
  );
}

export default App;
