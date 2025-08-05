import Index from "./pages/page/Index";
import Missing from "./pages/page/views/Missing";
import type { CustomRoute, IndexRoute } from "./pages/page/routing";
import CreateDocument from "./pages/page/views/CreateDocument";

export const protectedRoutes: CustomRoute[] = [];

export const publicRoutes: (CustomRoute | IndexRoute)[] = [
  { index: true, element: <Index /> },
  { path: "/create", element: <CreateDocument /> },
  { path: "*", element: <Missing /> },
];
