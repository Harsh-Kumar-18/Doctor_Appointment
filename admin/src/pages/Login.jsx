import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AdminContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const {setDToken} = useContext(DoctorContext)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          navigate("/admin-dashboard");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          navigate("/doctor-dashboard");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center bg-gray-50"
    >
      <div className="flex flex-col gap-4 w-full max-w-md mx-8 sm:mx-0 bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Title */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-800">
            <span className="text-primary">{state}</span> Login
          </p>
          <p className="text-gray-500 text-sm">
            Welcome back! Please login to continue
          </p>
        </div>

        {/* Email */}
        <div className="w-full">
          <p className="mb-1 font-medium">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Password */}
        <div className="w-full">
          <p className="mb-1 font-medium">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            required
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          Login
        </button>

        {/* Toggle */}
        <p className="text-sm text-center text-gray-600">
          {state === "Admin" ? "Doctor" : "Admin"} Login?{" "}
          <span
            onClick={() => setState(state === "Admin" ? "Doctor" : "Admin")}
            className="text-primary cursor-pointer font-medium"
          >
            Click here
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
