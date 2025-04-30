import { Outlet } from "react-router";
import { useAuth } from "./AuthProvider";
import NotLoggedInModal from "../components/NotLoggedInModal";

// const PrivateRoute = () => {
//   const user = useAuth();
//   if (!user.token) return <Navigate to="/login" />;

//   return <Outlet />;
// };
const PrivateRoute = () => {
  const user = useAuth();
  if (!user.token) return <NotLoggedInModal show={true} />;

  return <Outlet />;
};

export default PrivateRoute;
