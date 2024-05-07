import React from "react";
import "./Inbox.css";

import io from "socket.io-client";

import { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";

// import profile_pic from "../images/icon.jpeg";

import { ENDPOINT } from "../config.js";

import Message from "../components/Message";
import CreateChatroomModal from "../components/CreateChatroomModal";

const Inbox = (props) => {
  const messageEl = useRef(null);

  // State to store messages
  const [messages, setMessages] = useState([]);

  // State to store new message input
  const [messageInput, setMessageInput] = useState("");

  // State to store current chatroom
  const [chatroomID, setChatroomID] = useState(1);

  // State to store current chatroom
  const [chatroomData, setChatroomData] = useState(null);

  const [chatroomList, setChatroomList] = useState(null);

  //State to store socket instance
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log("useEffect triggered");
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }

    const newSocket = io(`${ENDPOINT}`);
    setSocket(newSocket);

    // const fetchedChatRoom = getChatroomById(chatroomID);
    // setChatroomData(fetchedChatRoom);

    getChatroomsWithUser(props.user.username);

    getMessagesByChatroomId(chatroomID)
      .then((fetchedMessages) => {
        // console.log("Fetched messages:", fetchedMessages);
        if (fetchedMessages.messages) {
          // Access the messages array
          const messagesArray = fetchedMessages.messages;
          console.log("Messages array:", messagesArray);

          const uniqueMessages = removeDuplicates(messagesArray, "text");
          console.log(uniqueMessages);

          setMessages(uniqueMessages);
        } else {
          console.error("No messages found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  function removeDuplicates(array, key) {
    return array.reduce((accumulator, currentItem) => {
      const existingItem = accumulator.find(
        (item) => item[key] === currentItem[key]
      );
      if (!existingItem) {
        accumulator.push(currentItem);
      }
      return accumulator;
    }, []);
  }

  async function getChatroomById(chatroomId) {
    // URL of the Flask endpoint that retrieves a chatroom by ID
    const url = `${ENDPOINT}/api/get_chatroom_by_id`;

    try {
      // Make the GET request to the Flask server
      const response = await fetch(url);
      if (response.ok) {
        const chatroom = await response.json();
        // console.log("Chatroom:", chatroom);
        // Process the retrieved chatroom data as needed
        return chatroom;
      } else {
        console.error("Failed to retrieve chatroom.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getMessagesByChatroomId(chatroomId) {
    // URL of the Flask endpoint that retrieves messages by chatroom ID
    const url = `${ENDPOINT}/api/get_messages_by_chatroom_id`;

    try {
      // Data to be sent in the request body
      const data = {
        chatroom_id: chatroomId,
      };

      // Options for the Fetch API
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      // Make the POST request to the Flask server
      const response = await fetch(url, options);
      if (response.ok) {
        const messages = await response.json();
        // console.log("Messages:", messages);
        // Process the retrieved messages data as needed
        return messages;
      } else {
        console.error("Failed to retrieve messages.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getChatroomsWithUser(username) {
    const url = `${ENDPOINT}/api/get_chatroomsWithUser`;

    try {
      // Data to be sent in the request body
      const data = {
        username: username,
      };

      // Options for the Fetch API
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      // Make the POST request to the Flask server
      const response = await fetch(url, options);
      const responseData = await response.json();

      if (response.ok) {
        // Extract chatrooms from the response data
        const chatrooms = responseData.chatrooms;
        console.log("Chatrooms:", chatrooms);
        setChatroomList(chatrooms);
        return chatrooms;
      } else {
        console.error("Failed to fetch chatrooms:", responseData.error);
        return [];
      }
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  // Stores form data when user inputs data
  const handleChange = (event) => {
    const input = event.target.value;
    setMessageInput(input);
  };

  // Replace SERVER_IP with server ip
  useEffect(() => {
    const newSocket = io(`${ENDPOINT}`);
    setSocket(newSocket);

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Stores form data when user inputs data
  const handleSubmit = async () => {
    // event.preventDefault();

    if (messageInput.trim() !== "") {
      const createdAt = new Date().toLocaleString([], {
        weekday: "long", // Display full weekday name (e.g., Monday)
        year: "numeric", // Display full numeric year (e.g., 2024)
        month: "long", // Display full month name (e.g., April)
        day: "numeric", // Display numeric day of the month (e.g., 27)
        hour: "2-digit", // Display two-digit hour (e.g., 08)
        minute: "2-digit", // Display two-digit minute (e.g., 05)
      });
      // Create a new message object
      const newMessage = {
        text: messageInput,
        sender: props.user.username,
        created_at: createdAt,
        chat_room_id: chatroomID,
      };

      console.log(props.user);

      // Send messasge to server
      if (socket) {
        socket.emit("message", newMessage);
      }

      // Get chatroom id from database (stretch)
      // inert message into database (stretch goal)

      // Update the messages state with the new message
      //setMessages([...messages, newMessage]);

      insertMessage(newMessage);

      // Clear the message input
      setMessageInput("");

      // Clear the input field
      document.querySelector(".compose-input").value = "";
    } else {
      alert("Message input isempty.");
    }
  };

  const insertMessage = async (newMessage) => {
    // URL of the Flask endpoint that inserts a new message
    const url = `${ENDPOINT}/api/insert_message`;

    try {
      // Make the POST request to the Flask server
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        console.log("Message inserted successfully.");
      } else {
        console.error("Failed to insert message.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle click on dm-listing div
  const handleChatroomClick = async (chatroomId) => {
    // Fetch messages for the clicked chatroom
    const fetchedMessages = await getMessagesByChatroomId(chatroomId);
    if (fetchedMessages.messages) {
      const messagesArray = fetchedMessages.messages;
      const uniqueMessages = removeDuplicates(messagesArray, "text");
      setMessages(uniqueMessages);
    } else {
      console.error("No messages found.");
    }
    // Set the selected chatroom ID
    setChatroomID(chatroomId);
  };

  return (
    <div className="Inbox">
      <div className="inbox-sidebar scrollable">
        <div>
          <CreateChatroomModal
            user={props.user.username}
            refreshChatRoomList={getChatroomsWithUser}
          />
        </div>

        {chatroomList &&
          chatroomList.map((chatroom, index) => (
            <div
              key={index}
              className={`dm-listing ${
                chatroomID === chatroom[0] ? "selected" : ""
              }`}
              onClick={() => handleChatroomClick(chatroom[0])}
              style={{ background: chatroomID === chatroom[0] ? "grey" : "" }}
              id={chatroom[0]}
            >
              <div className="dm-pic">
                {/* <img src={profile_pic} alt="user icon" /> */}
              </div>
              <div>
                <h3 className="dm-name">{chatroom[2]}</h3>
                <p className="dm-preview">Placeholder preview message</p>
              </div>
            </div>
          ))}
      </div>
      <div className="inbox-content">
        <div className="message-list-container scrollable" ref={messageEl}>
          {/* <div className="large-timestamp">
            Wednesday, April 3, 2024 8:37 PM
          </div> */}
          {messages.map((message, index) => (
            <Message
              key={index}
              text={message.text}
              type={message.sender == props.user.username ? "mine" : "other"}
              position={"last"}
              timestamp={message.created_at}
              sender={message.sender}
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
