import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginCredentials } from "../auth/auth-service";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logInAction } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const loginCreds: LoginCredentials = {
      email,
      password,
    };
    try {
      await logInAction(loginCreds);

      toast.success("Logged In!");
      navigate("/");
    } catch (err: any) {
      console.log("Error from login" + err);
      toast.error(err.message);
    }
  };

  return (
    <>
      <section className=" flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-blue-50">
        <div className="container m-auto max-w-2xl py-24">
          <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
            <form onSubmit={handleSubmit}>
              <h2 className="text-3xl text-center font-semibold mb-6">
                Sign In
              </h2>
              <div className="mb-4">
                <label
                  htmlFor="type"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="border rounded w-full py-2 px-3"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="type"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="border rounded w-full py-2 px-3"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </div>
              <div className="mb-4">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Sign In
                </button>
              </div>
              <div className="flex flex-row items-center justify-center gap-2">
                <span>Doesn't have an account</span>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="bg-none text-blue-400 hover:cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
