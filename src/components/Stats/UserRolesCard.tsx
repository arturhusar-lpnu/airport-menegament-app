import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { toast } from "react-toastify";

interface UserData {
  role_users: string;
  role_name: string;
}

const UserRolesCard = () => {
  const [usersData, setUsersData] = useState<UserData[]>([]);
  const { token } = useAuth();
  const fetchUsersRoles = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/stats/active-users",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.message);
      }
      setUsersData(response);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  useEffect(() => {
    fetchUsersRoles();
  }, [token]);

  const adminsCount = usersData.find((u) => u.role_name == "admin")?.role_users;
  const passengersCount = usersData.find(
    (u) => u.role_name == "passenger"
  )?.role_users;
  const managersCount = usersData.find(
    (u) => u.role_name == "terminal_manager"
  )?.role_users;

  return (
    <div className="rounded-md flex flex-col gap-2 max-w-sm text-white bg-gradient-to-br from-blue-950 to-blue-800 shadow-lg p-4">
      <h2 className="text-xl font-semibold">Active Users</h2>
      <div className="flex flex-col gap-2 space-x-4">
        <span>Admins: {adminsCount}</span>
        <span>Terminal Managers: {managersCount}</span>
        <span>Passengers: {passengersCount}</span>
      </div>
    </div>
  );
};

export default UserRolesCard;
