import Index from "./pages/page/Index";
import Missing from "./pages/page/views/Missing";
import type { CustomRoute, IndexRoute } from "./pages/page/routing";
import CreateDocument from "./pages/page/views/Create";
import Community from "./pages/page/views/Community";

export const protectedRoutes: CustomRoute[] = [];

export const publicRoutes: (CustomRoute | IndexRoute)[] = [
  { index: true, element: <Index /> },
  { path: "/create", element: <CreateDocument /> },
  { path: "/community", element: <Community /> },
  { path: "*", element: <Missing /> },
];
