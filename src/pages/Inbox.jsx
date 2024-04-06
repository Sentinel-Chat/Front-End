import React from "react";
import "./Inbox.css";

import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import profile_pic from "../images/icon.jpeg";

import Message from "../components/Message";
const Inbox = (props) => {
  const messageEl = useRef(null);

  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  return (
    <div className="Inbox">
      <div className="inbox-sidebar scrollable">
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
            <h3 className="dm-name">Kevin</h3>
            <p className="dm-preview">How are you today?</p>
          </div>
        </div>
        <div className="dm-listing">
          <div className="dm-pic" alt="user icon">
            <img src={profile_pic} alt="user icon" />{" "}
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
            <h3 className="dm-name">Kevin</h3>
            <p className="dm-preview">How are you today?</p>
          </div>
        </div>
        <div className="dm-listing">
          <div className="dm-pic" alt="user icon">
            <img src={profile_pic} alt="user icon" />{" "}
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
            <h3 className="dm-name">Kevin</h3>
            <p className="dm-preview">How are you today?</p>
          </div>
        </div>{" "}
        <div className="dm-listing">
          <div className="dm-pic" alt="user icon">
            <img src={profile_pic} alt="user icon" />{" "}
          </div>
          <div>
            <h3 className="dm-name">Kevin</h3>
            <p className="dm-preview">How are you today?</p>
          </div>
        </div>
      </div>
      <div className="inbox-content">
        <div className="message-list-container scrollable" ref={messageEl}>
          <div className="large-timestamp">
            Wednesday, April 3, 2024 8:37 PM
          </div>
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
            position="last"
            timestamp="8:44 PM"
          ></Message>
        </div>
        <div className="compose">
          <input
            type="text"
            className="compose-input"
            placeholder="Type a message"
          />
          <h2 className="send">Send</h2>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
