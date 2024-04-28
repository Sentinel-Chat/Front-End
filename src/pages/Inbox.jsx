import React from "react";
import "./Inbox.css";

import io from "socket.io-client";

import { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";

// import profile_pic from "../images/icon.jpeg";

import Message from "../components/Message";

const Inbox = (props) => {
  const messageEl = useRef(null);

  // State to store messages
  const [messages, setMessages] = useState([]);

  // State to store new message input
  const [messageInput, setMessageInput] = useState("");

  //State to store socket instance
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  // Stores form data when user inputs data
  const handleChange = (event) => {
    const input = event.target.value;
    setMessageInput(input);
  };

  // Replace SERVER_IP with server ip
  useEffect(() => {
    const newSocket = io("http://172.20.10.2:5000");
    setSocket(newSocket);

    newSocket.on("message", (message) => {
      console.log(message);
      console.log(messages);
      setMessages([...messages, message]);
    });

    return () => {
      //   newSocket.disconnect();
    };
  }, [messages]);

  // Stores form data when user inputs data
  const handleSubmit = async () => {
    // event.preventDefault();

    if (messageInput.trim() !== "") {
      // Create a new message object
      const newMessage = {
        text: messageInput,
        type: "mine",
        position: "last",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Send messasge to server
      if (socket) {
        socket.emit("message", newMessage);
      }

      // Get chatroom id from database (stretch)
      // inert message into database (stretch goal)

      // Update the messages state with the new message
      setMessages([...messages, newMessage]);

      // Clear the message input
      setMessageInput("");

      // Clear the input field
      document.querySelector(".compose-input").value = "";
    } else {
      alert("Message input is empty.");
    }
  };

  return (
    <div className="Inbox">
      {/* <div className="inbox-sidebar scrollable">
        <div className="dm-listing">
          <div className="dm-pic">
            <img src={profile_pic} alt="user icon" />
          </div>
          <div>
            <h3 className="dm-name">Kevin</h3>
            <p className="dm-preview">How are you today?</p>
          </div>
        </div>
        <div className="dm-listing">
          <div className="dm-pic" alt="user icon">
            <img src={profile_pic} alt="user icon" />{" "}
          </div>
          <div>
            <h3 className="dm-name">Joseph</h3>
            <p className="dm-preview">What did you think of the Exam?</p>
          </div>
        </div>
      </div> */}
      <div className="inbox-content">
        <div className="message-list-container scrollable" ref={messageEl}>
          {/* <div className="large-timestamp">
            Wednesday, April 3, 2024 8:37 PM
          </div> */}
          {/* <Message
            text="Hi, my name is Kevin."
            type="other"
            position="first"
            timestamp="8:37 PM"
          ></Message>
          <Message
            text="How are you today?"
            type="other"
            position="last"
            timestamp="8:38 PM"
          ></Message>

          <Message
            text="Nice to meet you!"
            type="mine"
            position="last"
            timestamp="8:44 PM"
          ></Message> */}

          {messages.map((message, index) => (
            <Message
              key={index}
              text={message.text}
              type={message.type}
              position={message.position}
              timestamp={message.timestamp}
            />
          ))}
        </div>
        <div className="compose">
          <input
            type="text"
            className="compose-input"
            placeholder="Type a message"
            onChange={(inputString) => {
              handleChange(inputString);
            }}
          />
          <h2
            className="send"
            onClick={() => {
              handleSubmit();
            }}
          >
            Send
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
