import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
// import { HelmetProvider } from "react-helmet-async";
// import { Theme } from "@radix-ui/themes";

// import PersistLogin from "./pkg/PersistLogin";
// import ErrorFallback from "./pkg/eboundary/ErrorBoundary";
import { AuthRouter } from "./pkg/firebase/auth/component/AuthRouter";
// import { ThemeProvider } from "./pkg/context/theme/ThemeProvider";
// import { useThemeContext } from "./pkg/context/theme/useThemeContext";
import { protectedRoutesFunc, publicRoutesFunc } from "./pages/page/routing";

import "@primer/primitives/dist/css/functional/themes/light.css";
import { ThemeProvider, BaseStyles } from "@primer/react";
import "@primer/react-brand/lib/css/main.css";
import EBoundary from "./pages/page/views/EBoundary";

import { ThemeProvider as LocalThemeProvider } from "./hooks/theme/ThemeProvider";
import { useThemeContext } from "./hooks/theme/useThemeContext";

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
    // <HelmetProvider>
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
    // </HelmetProvider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      {publicRoutesFunc()}
      {/* Protected Routes */}
      {/* <Route element={<PersistLogin />}> */}
      <Route element={<AuthRouter />}>{protectedRoutesFunc()}</Route>
      {/* </Route> */}
    </Routes>
  );
}

export default App;
