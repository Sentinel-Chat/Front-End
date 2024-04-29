import React from "react";
import "./App.css";
import { useState, useEffect } from "react";

import { Link, useRoutes } from "react-router-dom";
import socketIOClient from "socket.io-client";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Inbox from "./pages/Inbox";
// import Message from "./components/Message";

// replace 'YOUR_IP_ADDRESS' with server IP
const ENDPOINT = "http://172.20.10.2:5000";

const App = () => {
  const [socket, setSocket] = useState(null);

  // establish connection to server
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    console.log("Socket connected:", socket);
    setSocket(socket);

    createChatroomIfNotExists();

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

  // Login user
  const manageSession = (data) => {
    // Login/Signout user
    setAuthenticated(!authenticated);

    // Set logged in user data passed from Login.jsx
    setLoggedInUser(data);

    if (!authenticated && socket) {
      socket.emit("login", data);
    }

    if (authenticated) {
      socket.emit("logout", data); // send message to server when user is logged out
    }
  };

  // Signout user
  const logOut = () => {
    // Login/Signout user
    setAuthenticated(!authenticated);

    socket.emit("logout", loggedInUser); // send message to server when user is logged out

    // Set logged in user data passed from Login.jsx
    setLoggedInUser({
      username: "",
      password: "",
    });
  };

  async function createChatroomIfNotExists() {
    // URL of the Flask endpoint that handles the creation of chatrooms
    const url = "http://172.20.10.2:5000/api/create_chatroom";

    // Data to be sent in the request body
    const data = {
      chat_room_id: 1,
      created_at: new Date().toLocaleString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      nickname: "General",
    };

    // Options for the Fetch API
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      // Make the POST request to the Flask server
      const response = await fetch(url, options);
      if (response.ok) {
        console.log("Chatroom created successfully or already exists.");
      } else {
        console.error("Failed to create chatroom.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

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
          {/* <Link to="inbox"> */}
          <h5>Sentinel-Chat</h5>
          {/* </Link> */}
        </div>

        <ul className="nav-links">
          {/* The following elements only appears when user is logged in*/}
          {authenticated ? (
            <>
              <li>
                {/* Link to account information page */}
                {/* <Link to={"/inbox/account/" + loggedInUser.id}> */}
                <h6 className="login-link">
                  Logged in as: {loggedInUser.username}
                </h6>
                {/* </Link> */}
              </li>
              <li>
                <Link to="/">
                  <h6 className="login-link" onClick={logOut}>
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
