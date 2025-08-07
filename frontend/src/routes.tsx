import Index from "./pages/page/views/Index";
import Missing from "./pages/page/views/Missing";
import type { CustomRoute, IndexRoute } from "./pages/page/routing";
import CreateDocument from "./pages/page/views/Create";
import Community from "./pages/page/views/Community";
import Base from "./pages/page/Base";

export const protectedRoutes: CustomRoute[] = [];

export const publicRoutes: (CustomRoute | IndexRoute)[] = [
  {
    index: true,
    element: (
      <Base>
        <Index />
      </Base>
    ),
  },
  { path: "*", element: <Missing /> },
  {
    path: "/community",
    element: (
      <Base>
        <Community />
      </Base>
    ),
  },
  {
    path: "/community/view/:documentID",
    element: (
      <Base>
        <Community withID />
      </Base>
    ),
  },
  {
    path: "/create",
    element: (
      <Base>
        <CreateDocument />
      </Base>
    ),
  },
];
