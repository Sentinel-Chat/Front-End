import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = (props) => {
  // User Login information
  const [loginInfo, setLoginInfo] = useState({
    id: "",
    password: "",
  });
  const navigate = useNavigate();

  // Login User and bring user to inbox page
  const handleLogin = async (event) => {
    event.preventDefault();

    if (loginInfo.username !== "") {
      // Check if password matches password in database
      if (true) {
        // Get account data from database

        // call manageSession() function from App.jsx
        // props.loginUser(fetchedLogin.data.getAccount);
        navigate("/Inbox");
      } else {
        alert("Incorrect Credentials! Please try again.");
      }
    }
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
