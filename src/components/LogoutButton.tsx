import { useAuth } from "../auth/AuthProvider";

const LogoutButton = () => {
  const { logOut } = useAuth();

  return (
    <button onClick={logOut} className="btn-submit">
      {" "}
      Log Out
    </button>
  );
};

export default LogoutButton;
