import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

// import { ENDPOINT } from "../config.js";

const Login = (props) => {
  // User Login information
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
    encryptedSessionKey: "",
  });
  //   const navigate = useNavigate();

  // Login User and bring user to inbox page
  const handleLogin = (event) => {
    event.preventDefault();

    // Validate that id and password are not empty
    if (!loginInfo.username || !loginInfo.password) {
      alert("Username and password are required.");
      return;
    }

    props.loginUser(loginInfo);
  };

  // Stores form data when user inputs data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLoginInfo((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  return (
    <div className="Login">
      <div className="form-container">
        <h1>Login</h1>

        <form className="input-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          ></input>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          ></input>
          <button onClick={handleLogin}>Login</button>
        </form>

        <div>
          <p>
            New to us?{" "}
            <Link className="link" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
