import { useContext, createContext, ReactNode, useState } from "react";
import { useNavigate } from "react-router";
import {
  decodeToken,
  JwtPayload,
  LoginCredentials,
  RegisterCredentials,
} from "./auth-service";

interface AuthContextType {
  token: string;
  user: JwtPayload | null;
  loginInAction: (loginCreds: LoginCredentials) => Promise<void>;
  logOut: () => void;
  signUpAction: (regCreds: RegisterCredentials) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<JwtPayload | null>(null);

  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  const loginInAction = async (loginCreds: LoginCredentials) => {
    const response = await fetch("http://localhost:3000/api/v1/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginCreds),
    });
    const res = await response.json();
    if (res.data) {
      const resToken = res.data.token;
      const userPayload = decodeToken(resToken);
      setUser(userPayload);
      setToken(resToken);
      localStorage.setItem("token", resToken);
      navigate("/");
      return;
    }
    throw new Error(res.message);
  };

  const signUpAction = async (regCreds: RegisterCredentials) => {
    const response = await fetch("http://localhost:3000/api/v1/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(regCreds),
    });
    const res = await response.json();

    if (res.message) {
      throw new Error(res.message || "Registration failed");
    }
    const login: LoginCredentials = {
      email: regCreds.email,
      password: regCreds.password,
    };

    await loginInAction(login);

    return;
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, loginInAction, logOut, signUpAction }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
