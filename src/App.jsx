import React from "react";
import "./App.css";
import { useState, useEffect } from "react";

import { Link, useRoutes, useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Inbox from "./pages/Inbox";

import forge from "node-forge";

import { ENDPOINT } from "./config.js";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [rsaKeyPair, setRsaKeyPair] = useState({
    publicKey: "",
    privateKey: "",
  });

  const navigate = useNavigate();

  // establish connection to server
  useEffect(() => {
    // Generate RSA key pair when component mounts
    const generateRsaKeyPair = async () => {
      const rsa = forge.pki.rsa;
      const keyPair = rsa.generateKeyPair({ bits: 2048, e: 65537 });
      const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
      const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);

      console.log("Private Key:", privateKeyPem);
      console.log("Public Key:", publicKeyPem);
      setRsaKeyPair({ privateKey: privateKeyPem, publicKey: publicKeyPem });
    };

    generateRsaKeyPair();
    const socket = socketIOClient(ENDPOINT);
    console.log("Socket connected:", socket);
    setSocket(socket);

    createChatroomIfNotExists();

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  //   // Use the rsaKeyPair state within a separate useEffect hook
  //   useEffect(() => {
  //     console.log("RSA Key Pair:", rsaKeyPair);
  //   }, [rsaKeyPair]);

  // Use to check if user logged in or not
  const [authenticated, setAuthenticated] = useState(false);

  // Information from the logged in user
  const [loggedInUser, setLoggedInUser] = useState({
    username: "",
    password: "",
    sessionKey: "",
  });

  const decryptSessionKey = (encryptedSessionKey, privateKeyPem) => {
    try {
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

      console.log(encryptedSessionKey);

      // Decrypt the encrypted session key using the private key
      const decryptedSessionKey = privateKey.decrypt(
        encryptedSessionKey,
        "RSA-OAEP",
        {
          md: forge.md.sha256.create(),
          mgf1: {
            md: forge.md.sha256.create(),
          },
        }
      );

      // Return the decrypted session key
      return decryptedSessionKey;
    } catch (error) {
      console.error("Error decrypting session key:", error);
      return null;
    }
  };

  const decodeSessionKey = (sessionKey) => {
    try {
      // Decode the Base64-encoded session key
      const decodedSessionKey = atob(sessionKey);

      // Return the decoded session key
      return decodedSessionKey;
    } catch (error) {
      console.error("Error decoding session key:", error);
      return null;
    }
  };

  const encodeSessionKey = (sessionKey) => {
    try {
      // Encode the session key to Base64
      const encodedSessionKey = btoa(sessionKey);

      // Return the encoded session key
      return encodedSessionKey;
    } catch (error) {
      console.error("Error encoding session key:", error);
      return null;
    }
  };

  const loginUser = async (loginInfo) => {
    const handshake = {
      username: loginInfo.username,
      password: loginInfo.password,
      userPublicKey: rsaKeyPair.publicKey,
    };

    console.log("Public Key:", rsaKeyPair.publicKey);

    // try {
    const response = await fetch(`${ENDPOINT}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(handshake), // Convert object to JSON string
    });

    //   console.log(response.body);
    if (response.ok) {
      const data = await response.json();
      console.log(data.sessionKey);
      // Check if the response contains account information
      if (data.account == null) {
        //   console.log(data.account);
        // Check if the entered password matches the password from the database
        if (loginInfo.password === data.password) {
          // Passwords match, navigate to the inbox page
          // call manageSession() function from App.jsx
          // console.log("works until here");

          // Use the updated functions to decrypt the session key
          const decryptedSessionKey = decryptSessionKey(
            decodeSessionKey(data.sessionKey),
            rsaKeyPair.privateKey
          );
          console.log(encodeSessionKey(decryptedSessionKey));

          const fetchedData = {
            username: data.username,
            password: data.password,
            sessionKey: decryptedSessionKey,
          };

          //   console.log("works until here");

          manageSession(fetchedData);

          navigate("/Inbox");
        } else {
          // Passwords don't match
          alert("Incorrect password or Account doesn't exist.");
        }
      } else {
        // Account not found
        alert("Incorrect password or Account doesn't exist.");
      }
    } else {
      // Server error
      alert("Error retrieving account. Please try again later.");
    }
    // } catch (error) {
    //   //   console.log("Error creating account:", error);
    //   alert("SOMETHING STUPID HAPPENED");
    // }
  };

  // Login user
  const manageSession = (data) => {
    // Login/Signout user
    setAuthenticated(!authenticated);

    setLoggedInUser({
      username: data.username,
      password: data.password,
      sessionKey: data.sessionKey,
    });

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
      sessionKey: "",
    });
  };

  async function createChatroomIfNotExists() {
    // URL of the Flask endpoint that handles the creation of chatrooms
    const url = `${ENDPOINT}/api/create_chatroom`;

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
      element: <Login loginUser={loginUser} rsaKeyPair={rsaKeyPair} />,
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
