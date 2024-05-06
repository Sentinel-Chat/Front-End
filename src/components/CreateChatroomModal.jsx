import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./CreateChatroomModal.css";

import { ENDPOINT } from "../config.js";

const CreateChatroomModal = (props) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [selectedUsernames, setSelectedUsernames] = useState([]);

  const [fetchedUsernames, setFetchedUsernames] = useState([]);

  useEffect(() => {
    fetchUsernames();
  }, []);

  const fetchUsernames = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/api/get_all_usernames`);
      if (response.ok) {
        const data = await response.json();
        setFetchedUsernames(
          data.usernames.filter((username) => username !== props.user)
        );
      } else {
        console.error("Failed to fetch usernames");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleCreateChatroom = () => {
    // Call the function to create a new chatroom
    // Pass the nickname and other necessary data
    createChatroom();
    closeModal();
  };

  const handleUserCheckboxChange = (event) => {
    const username = event.target.value;
    if (event.target.checked) {
      setSelectedUsernames([...selectedUsernames, username]);
    } else {
      setSelectedUsernames(
        selectedUsernames.filter((name) => name !== username)
      );
    }

    console.log(selectedUsernames);
  };

  // Stores form data when user inputs data
  const handleChange = (event) => {
    const input = event.target.value;
    setNickname(input);
  };

  async function createChatroom() {
    // URL of the Flask endpoint that handles the creation of chatrooms
    const url = `${ENDPOINT}/api/create_chatroom_returnID`;

    // Data to be sent in the request body
    const data = {
      created_at: new Date().toLocaleString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      nickname: nickname,
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
        const responseData = await response.json();
        const chatroomId = responseData.chatroom_id;
        console.log("Chatroom created with ID:", chatroomId);

        addUserToChatroom(props.user, chatroomId);
        console.log("added " + props.user);

        selectedUsernames.map((username) => {
          addUserToChatroom(username, chatroomId);
          console.log("added " + username);
        });
        props.refreshChatRoomList(props.user);

        console.log("sucess!");
      } else {
        console.error("Failed to create chatroom.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function addUserToChatroom(username, chatRoomId) {
    const url = `${ENDPOINT}/api/add_user_to_chatroom`;

    try {
      // Data to be sent in the request body
      const data = {
        username: username,
        chat_room_id: chatRoomId,
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
        console.log("User added to chatroom successfully");
      } else {
        console.error("Failed to add user to chatroom:", responseData.error);
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  return (
    <div className="CreateChatroomModal">
      <button className="create-Chatroom-button" onClick={openModal}>
        Create Chatroom
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "fit-content",
            height: "fit-content",
            margin: "auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          },
        }}
      >
        <h2>Create a New Chatroom</h2>
        <input
          className="input-form"
          type="text"
          placeholder="Enter chatroom nickname"
          value={nickname}
          onChange={handleChange}
        />

        <div>
          <h2>Select Usernames to Add:</h2>
          {fetchedUsernames.map((username, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={`user-${index}`}
                value={username}
                onChange={handleUserCheckboxChange}
              />
              <label htmlFor={`user-${index}`}>{username}</label>
            </div>
          ))}
        </div>
        <button onClick={handleCreateChatroom}>Create</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default CreateChatroomModal;
