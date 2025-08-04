import Index from "./pages/page/Index";
import Missing from "./pages/page/views/Missing";
import type { CustomRoute, IndexRoute } from "./pages/page/routing";

export const protectedRoutes: CustomRoute[] = [];

export const publicRoutes: (CustomRoute | IndexRoute)[] = [
  { index: true, element: <Index /> },
  { path: "*", element: <Missing /> },
];
