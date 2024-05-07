import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

import { ENDPOINT } from "../config.js";

const Login = (props) => {
  // User Login information
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  // Login User and bring user to inbox page
  const handleLogin = async (event) => {
    event.preventDefault();

    // Validate that id and password are not empty
    if (!loginInfo.username || !loginInfo.password) {
      alert("Username and password are required.");
      return;
    }

    try {
      const response = await fetch(`${ENDPOINT}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo), // Convert object to JSON string
      });

      alert(response.body);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // Check if the response contains account information
        if (data.account == null) {
          alert(data.account);
          // Check if the entered password matches the password from the database
          if (loginInfo.password === data.password) {
            // Passwords match, navigate to the inbox page
            // call manageSession() function from App.jsx
            console.log("works until here");

            const fetchedData = {
              username: data.username,
              password: data.password,
            };

            props.loginUser(fetchedData);

            navigate("/Inbox");
          } else {
            // Passwords don't match
            alert("Incorrect password.");
          }
        } else {
          // Account not found
          alert("Account not found.");
        }
      } else {
        // Server error
        alert("Error retrieving account. Please try again later.");
      }
    } catch (error) {
      //   console.log("Error creating account:", error);
      alert("Error retrieving account. Please try again later.");
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
