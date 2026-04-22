import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from 'axios'
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
 
const Login = () => {
  const [state, setState] = useState("Sign Up");

  // ✅ states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {token, setToken, backendUrl} = useContext(AppContext)
  const navigate = useNavigate()
 
  // ✅ submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if(state === 'Sign Up') {
        const {data} = await axios.post(backendUrl + '/api/user/register',{name,email,password})
        if (data.success){
          localStorage.setItem('token', data.token)
          setToken(data.token)
        }else {
          toast.error(data.message)
        }
      } else {
        const {data} = await axios.post(backendUrl + '/api/user/login',{email,password})
        if (data.success){
          localStorage.setItem('token', data.token)
          setToken(data.token)
        }else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-lg p-8"
      >
        {/* Heading */}
        <p className="text-2xl font-semibold text-gray-800">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Please {state === "Sign Up" ? "sign up" : "login"} to book appointment
        </p>

        <div className="flex flex-col gap-4 mt-6">
          {state === "Sign Up" && (
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-600">Full Name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm text-gray-600">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-primary"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white py-3 rounded-lg mt-2 hover:opacity-90 transition-all"
          >
            {state === "Sign Up" ? "Create account" : "Login"}
          </button>

          <p className="text-sm text-gray-600 text-center">
            {state === "Sign Up"
              ? "Already have an account?"
              : "Don't have an account?"}
            <span
              onClick={() =>
                setState(state === "Sign Up" ? "Login" : "Sign Up")
              }
              className="text-primary cursor-pointer ml-1"
            >
              {state === "Sign Up" ? "Login here" : "Create account"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;