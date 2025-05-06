import { NavLink } from "react-router-dom";
import logo from "../assets/react.svg";
import { useAuth } from "../auth/AuthProvider";
import { UserRoles } from "../models/user-roles";
// import LoginButton from "./LoginButton";
import Profile from "./Profile";
import { decodeToken } from "../auth/auth-service";

const Navbar = () => {
  const linkClass = ({ isActive }: { isActive: boolean }): string =>
    isActive
      ? "text-white bg-black hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  const auth = useAuth();

  const { token } = auth;
  const user = decodeToken(token);
  return (
    <nav className="bg-blue-600 border-b border-blue-400 sticky top-0 z-50">
      <div className="mx-auto max-w-8xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-15 items-center justify-between">
          <div className="flex items-center flex-shrink-0">
            <NavLink
              to="/"
              className="flex flex-shrink-1 items-center mr-4 gap-2"
            >
              <img className="h-10 w-auto" src={logo} alt="Lemb Air" />
              <span className="text-white">LembAir</span>
            </NavLink>
          </div>
          <div className="hidden md:flex md:space-x-4">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/flights" className={linkClass}>
              Flights
            </NavLink>
            {/* <NavLink to="/buy-ticket" className={linkClass}>
              Buy Ticket
            </NavLink> */}
            {user && (
              <>
                {user.roles.includes(UserRoles.Admin) && (
                  <NavLink to="/gates" className={linkClass}>
                    Gates Reports{" "}
                  </NavLink>
                )}
                {user.roles.includes(
                  UserRoles.TerminalManager || UserRoles.Admin
                ) && (
                  <NavLink to="/tickets" className={linkClass}>
                    Tickets Registry
                  </NavLink>
                )}
              </>
            )}
            {user && (
              <>
                {user.roles.includes(UserRoles.Admin) && (
                  <NavLink to="/stats" className={linkClass}>
                    Stats
                  </NavLink>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {user ? (
              <Profile user={user} />
            ) : (
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
