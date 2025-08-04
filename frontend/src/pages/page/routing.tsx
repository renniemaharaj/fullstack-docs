import { Route } from "react-router-dom";
import Suspended from "./views/Suspended";
import { protectedRoutes, publicRoutes } from "../../routes";

export interface Primitve {
  element: React.JSX.Element;
  suspended?: boolean;
}

export interface CustomRoute extends Primitve {
  path: string;
}

export interface IndexRoute extends Primitve {
  index: true;
}

const passThrough = (route: CustomRoute) =>
  route.suspended ? <Suspended /> : route.element;

export const publicRoutesFunc = () => {
  return publicRoutes.map((route, i) =>
    "index" in route ? (
      <Route key={`public-index` + i} index element={route.element} />
    ) : (
      <Route
        key={`public-${route.path}` + i}
        path={route.path}
        element={passThrough(route)}
      />
    ),
  );
};

export const protectedRoutesFunc = () => {
  return protectedRoutes.map((route, i) => (
    <Route
      key={`private-${route.path}` + i}
      path={route.path}
      element={passThrough(route)}
    />
  ));
};
