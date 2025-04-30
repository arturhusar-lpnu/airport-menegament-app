import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from "@headlessui/react";
import { JwtPayload } from "../auth/auth-service";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router";
import { UserRoles } from "../models/user-roles";

const Profile = ({ user }: { user: JwtPayload }) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const roleColors = (role: UserRoles) => {
    console.log(role);
    switch (role) {
      case UserRoles.Admin:
        return "bg-red-100 text-red-800";
      case UserRoles.TerminalManager:
        return "bg-yellow-100 text-yellow-800";
      case UserRoles.Passenger:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="px-4 py-2 rounded-md bg-white text-blue-700 hover:cursor-pointer hover:bg-blue-50">
        {user.username}
      </MenuButton>
      <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg focus:outline-none">
        <MenuItem
          as="div"
          className="flex flex-col px-4 py-2 text-sm text-gray-700"
        >
          {Array.isArray(user.roles) ? (
            <>
              <span>Roles: </span>
              <ul className="space-y-1">
                {user.roles.map((role) => (
                  <li
                    key={role}
                    className={`inline-block px-2 py-1 rounded text-xs font-semibold
            ${roleColors(role)}
          `}
                  >
                    {role}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span>{`Role: ${user.roles}`}</span>
          )}
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          as="button"
          className={({ active }) =>
            `block w-full text-left px-4 py-2 text-sm rounded-md hover:cursor-pointer ${
              active ? "bg-blue-100" : "text-gray-900"
            }`
          }
          onClick={() => navigate("/my-tickets")}
        >
          My tickets
        </MenuItem>
        <MenuSeparator />
        <MenuItem
          as="button"
          className={({ active }) =>
            `block w-full text-left px-4 py-2 text-sm rounded-md text-red-600 hover:cursor-pointer ${
              active ? "bg-red-100" : ""
            }`
          }
          onClick={logOut}
        >
          Sign Out
        </MenuItem>
      </MenuItems>
    </Menu>
  );
};

export default Profile;
