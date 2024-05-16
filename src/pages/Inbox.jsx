import React from "react";
import "./Inbox.css";

import io from "socket.io-client";

import { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";

// import profile_pic from "../images/icon.jpeg";

import { ENDPOINT } from "../config.js";

import Message from "../components/Message";
import CreateChatroomModal from "../components/CreateChatroomModal";

import forge from "node-forge";

import AES from "aes-js";

import { TextEncoder, TextDecoder } from "text-encoding";

const Inbox = (props) => {
  const messageEl = useRef(null);

  // State to store messages
  const [messages, setMessages] = useState([]);

  // State to store new message input
  const [messageInput, setMessageInput] = useState("");

  // State to store current chatroom
  const [chatroomID, setChatroomID] = useState(1);

  // State to store current chatroom
  //   const [chatroomData, setChatroomData] = useState(null);

  const [chatroomList, setChatroomList] = useState(null);

  //State to store socket instance
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect triggered");

    if (props.user.username === "" || props.user.username === null) {
      navigate("/");
    }

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
          //   console.log("Messages array:", messagesArray);

          const uniqueMessages = removeDuplicates(messagesArray, "text");
          //   console.log(uniqueMessages);

          setMessages(uniqueMessages);
        } else {
          console.error("No messages found.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // eslint-disable-next-line
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

  //   async function getChatroomById(chatroomId) {
  //     // URL of the Flask endpoint that retrieves a chatroom by ID
  //     const url = `${ENDPOINT}/api/get_chatroom_by_id`;

  //     try {
  //       // Make the GET request to the Flask server
  //       const response = await fetch(url);
  //       if (response.ok) {
  //         const chatroom = await response.json();
  //         // console.log("Chatroom:", chatroom);
  //         // Process the retrieved chatroom data as needed
  //         return chatroom;
  //       } else {
  //         console.error("Failed to retrieve chatroom.");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }

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

  // Remove PKCS7 padding from the decrypted message
  function removePadding(decryptedMessage) {
    // Get the last byte, which indicates the number of padding bytes
    const paddingLength = decryptedMessage.charCodeAt(
      decryptedMessage.length - 1
    );

    // Check if the padding length is valid
    if (paddingLength < 1 || paddingLength > 16) {
      throw new Error("Invalid padding length");
    }

    // Remove the padding bytes
    return decryptedMessage.slice(0, -paddingLength);
  }

  // Replace SERVER_IP with server ip
  useEffect(() => {
    const newSocket = io(`${ENDPOINT}`);
    setSocket(newSocket);

    newSocket.on("message", (message) => {
      console.log("decrypted message:");
      console.log(message);

      // Decode the received data
      //   const iv = forge.util.decode64(message.iv);
      //   const authTag = forge.util.decode64(message.authTag);
      //   const encryptedMessage = forge.util.decode64(message.encryptedMessage);

      //   // Decrypt the message
      //   const decipher = forge.cipher.createDecipher(
      //     "AES-GCM",
      //     forge.util.decode64(message.sessionKey)
      //   );
      //   decipher.start({
      //     iv,
      //     tag: authTag,
      //   });
      //   decipher.update(forge.util.createBuffer(encryptedMessage));
      //   if (!decipher.finish()) {
      //     throw new Error("Failed to decrypt the message");
      //   }
      //   const decryptedMessage = decipher.output.data;

      //   // Parse the decrypted message string into a JavaScript object
      //   const decryptedMessageObj = JSON.parse(removePadding(decryptedMessage));

      //   // Handle the decrypted message object
      //   console.log(decryptedMessageObj);

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const encryptNewMessage = async (newMessage, sessionKey) => {
    try {
      const messageJson = JSON.stringify(newMessage);
      const messageBytes = forge.util.encodeUtf8(messageJson);
      const iv = forge.random.getBytesSync(12); // 96-bit IV for GCM mode
      const ivBase64 = forge.util.encode64(iv); // Encode IV in base64

      //   console.log(sessionKey);

      const cipher = forge.cipher.createCipher("AES-GCM", sessionKey);
      cipher.start({ iv: iv });

      cipher.update(forge.util.createBuffer(messageBytes));
      cipher.finish();

      const encryptedBytes = cipher.output.getBytes();
      const authTag = cipher.mode.tag.getBytes();

      // Encode encrypted message, IV, and auth tag in base64
      const encryptedMessageBase64 = forge.util.encode64(encryptedBytes);
      const authTagBase64 = forge.util.encode64(authTag);

      return {
        encryptedMessage: encryptedMessageBase64,
        iv: ivBase64,
        authTag: authTagBase64,
      };
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (messageInput.trim() !== "") {
      const createdAt = new Date().toLocaleString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const decryptedSessionKey = props.user.sessionKey;

      const newMessage = {
        text: messageInput,
        sender: props.user.username,
        created_at: createdAt,
        chat_room_id: chatroomID,
      };

      try {
        const encryptedMessage = await encryptNewMessage(
          newMessage,
          decryptedSessionKey
        );

        if (socket) {
          socket.emit("message", {
            sender: props.user.username,
            encryptedMessage: encryptedMessage.encryptedMessage,
            iv: encryptedMessage.iv,
            authTag: encryptedMessage.authTag, // Send authTag directly
          });
        }

        // insertMessage(newMessage);

        setMessageInput("");
        document.querySelector(".compose-input").value = "";
      } catch (error) {
        alert("Encryption failed. Please try again.");
        console.error("Encryption error:", error);
      }
    } else {
      alert("Message input is empty.");
    }
  };

  //   const insertMessage = async (newMessage) => {
  //     // URL of the Flask endpoint that inserts a new message
  //     const url = `${ENDPOINT}/api/insert_message`;

  //     try {
  //       // Make the POST request to the Flask server
  //       const response = await fetch(url, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(newMessage),
  //       });

  //       if (response.ok) {
  //         console.log("Message inserted successfully.");
  //       } else {
  //         console.error("Failed to insert message.");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };

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
                {/* <p className="dm-preview">Placeholder preview message</p> */}
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
