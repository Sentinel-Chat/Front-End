import React from "react";
import "./Inbox.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Message from "../components/Message";

const Inbox = (props) => {
  return (
    <div className="Inbox">
      <h1>Chat starts here</h1>
      <div className="message-list-container">
        <Message
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
          position="first"
          timestamp="8:44 PM"
        ></Message>
        <Message
          text="My name is Daniel"
          type="mine"
          position="last"
          timestamp="8:44 PM"
        ></Message>
      </div>
    </div>
  );
};

export default Inbox;
