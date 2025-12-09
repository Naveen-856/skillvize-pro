import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../assets/My-icon.png";
import AuthBg from "../../assets/Auth.png";
import BlurText from "../../component/BlurText";

const Login = () => {
  const navigate = useNavigate();
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gmail, password }),
      });

      const data = await response.json();

      if (data.token) {
        // Save login session
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/"); // Redirect after successful login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-white dark:bg-black">
      <div className="flex justify-center h-screen">
        <div className="hidden relative lg:flex lg:w-2/3 lg:items-center">
          <img
            src={AuthBg}
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 px-20 w-full max-w-4xl">
            <div className="rounded-3xl p-10 shadow-2xl">
              <BlurText
                text="Skillvize"
                delay={150}
                animateBy="words"
                direction="top"
                className="text-7xl mb-8 text-white font-bold dark:text-gray-200 shadow-lg"
              />
              <p className="text-xl text-gray-200 leading-relaxed font-light">
                Upgrade your skills. Find the right roadmap. <br />
                <span className="font-semibold text-blue-300">Build the best version of yourself.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <div className="flex justify-center mx-auto">
                <img className="w-auto h-10" src={Icon} alt="SkillVize Logo" />
              </div>

              <p className="mt-3 text-gray-500 dark:text-gray-300">
                Login to your SkillVize account
              </p>
            </div>

            <div className="mt-8">
              <form onSubmit={handleLogin}>
                <div className="mt-4">
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Gmail
                  </label>
                  <input
                    type="email"
                    name="gmail"
                    placeholder="example@gmail.com"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:outline-none"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <label className="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Your Password"
                    className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none"
                  >
                    Login
                  </button>
                </div>
              </form>

              <p className="mt-6 text-sm text-center text-gray-400">
                Don't have an account?
                <a href="/register" className="text-blue-500 hover:underline">
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
