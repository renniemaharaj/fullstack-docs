import { Outlet } from "react-router-dom";
import useUserLikelySignedIn from "../hooks/useUserLikelySignedIn";
import Unauthenticated from "../../../../pages/page/views/Unauthenticated";

export const AuthRouter = () => {
  const { token } = useUserLikelySignedIn();
  return token ? <Outlet /> : <Unauthenticated />;
};
