import React from "react";
import "./SignUp.css";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  // New user data
  const [credentials, setCredentials] = useState({
    id: "",
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

  // Create new entry in database and return to Login page
  const handleSignUp = async (event) => {
    event.preventDefault();
    if (credentials.id !== "" && credentials.password !== "") {
      if (credentials.password === passwordCheck) {
        try {
          // Create new entry in database
          navigate("/");
        } catch (error) {
          console.log("error on creating account", error);
        }
      } else {
        alert("Passwords do not match.");
      }
    } else {
      alert("Fields cannot be empty.");
    }
  };

  return (
    <div className="SignUp">
      <h1 className="create-account">Create Account</h1>

      <form className="input-form">
        <input
          type="text"
          id="id"
          name="id"
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
