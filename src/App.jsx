import React from "react";
import "./App.css";
import { useState, useEffect } from "react";

import { Link, useRoutes } from "react-router-dom";
import socketIOClient from "socket.io-client";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Inbox from "./pages/Inbox";
import Message from "./components/Message";

// replace 'YOUR_IP_ADDRESS' with server IP
const ENDPOINT = "http://192.168.254.12:5000";

const App = () => {
  const [socket, setSocket] = useState(null);

  // establish connection to server
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    console.log("Socket connected:", socket);
    setSocket(socket);

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  // Use to check if user logged in or not
  const [authenticated, setAuthenticated] = useState(false);

  // Information from the logged in user
  const [loggedInUser, setLoggedInUser] = useState({
    username: "",
    password: "",
  });

  // Login/Signout user
  const manageSession = (data) => {
    // Login/Signout user
    setAuthenticated(!authenticated);

    // Set logged in user data passed from Login.jsx
    setLoggedInUser(data);

    if (socket) {
      socket.emit("login", data); // send messsage to server when user is logged in
    }
  };

  // Declare React Router pages to be used
  let element = useRoutes([
    {
      path: "/",
      // pass manageSession as prop so it can be used in Login.jsx
      element: <Login loginUser={manageSession} />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/inbox",
      // pass logged in user data so it can used in Inbox.jsx
      element: <Inbox user={loggedInUser} />,
    },
  ]);

  return (
    <div className="App">
      {/* Navbar */}
      <div className="nav-bar">
        <div className="nav-title">
          <Link to="inbox">
            <h5>Sentinel-Chat</h5>
          </Link>
        </div>

        <ul className="nav-links">
          {/* The following elements only appears when user is logged in*/}
          {authenticated ? (
            <>
              <li>
                {/* Link to account information page */}
                {/* <Link to={"/inbox/account/" + loggedInUser.id}> */}
                <h6 className="login-link">View Account: {loggedInUser.id}</h6>
                {/* </Link> */}
              </li>
              <li>
                <Link to="/">
                  <h6 className="login-link" onClick={manageSession}>
                    Logout
                  </h6>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/">
                <h6 className="login-link">Login</h6>
              </Link>
            </li>
          )}
        </ul>
      </div>
      {/* React Router pages declared above appear here as the body */}
      {element}
    </div>
  );
};

export default App;
