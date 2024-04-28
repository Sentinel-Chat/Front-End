import React from "react";
import "./SignUp.css";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  // New user data
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Used for password verification
  const [passwordCheck, setPasswordCheck] = useState("");

  // Stores form data when user inputs data
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    console.log(credentials);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Validate that id and password are not empty
    if (!credentials.username || !credentials.password) {
      alert("Username and password are required.");
      return;
    }

    // Validate that passwords match
    if (credentials.password !== passwordCheck) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://172.20.10.2:5000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials), // Convert object to JSON string
      });

      if (response.ok) {
        // User created successfully, navigate to login page
        navigate("/");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to create user");
      }
    } catch (error) {
      console.log("Error creating account:", error);
      alert("Error creating account. Please try again later.");
    }
  };

  return (
    <div className="SignUp">
      <h1 className="create-account">Create Account</h1>

      <form className="input-form">
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
        ></input>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
        ></input>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Re-enter Password"
          value={passwordCheck}
          onChange={(event) => {
            const { value } = event.target;
            setPasswordCheck(value);
          }}
        ></input>
        <button onClick={handleSignUp}>Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
