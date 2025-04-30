import { useNavigate } from "react-router-dom";
type LoginButtonProps = {
  className?: string;
};

const LoginButton = ({ className }: LoginButtonProps) => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <button onClick={handleLogin} className={`${className} btn-submit`}>
      Log In
    </button>
  );
};

export default LoginButton;
