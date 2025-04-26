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

const Profile = ({ user }: { user: JwtPayload }) => {
  const { logOut } = useAuth();
  const navigate = useNavigate();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="px-4 py-2 rounded-md bg-white text-blue-700 hover:cursor-pointer hover:bg-blue-50">
        {user.username}
      </MenuButton>
      <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg focus:outline-none">
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
