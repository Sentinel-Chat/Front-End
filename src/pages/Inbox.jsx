import React from "react";
import "./Inbox.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Message from "../components/Message";

const Inbox = (props) => {
  return (
    <div className="Inbox">
      <div className="inbox-sidebar">
        {" "}
        <h1>hello</h1>
      </div>
      <div className="inbox-content">
        <div className="message-list-container scrollable">
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
            position="first"
            timestamp="8:44 PM"
          ></Message>
          <Message
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi blandit cursus risus at ultrices mi tempus. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nibh tortor id aliquet lectus proin nibh nisl condimentum id. Vitae elementum curabitur vitae nunc sed velit dignissim sodales. Suscipit tellus mauris a diam. Et egestas quis ipsum suspendisse ultrices gravida dictum fusce. Suspendisse in est ante in nibh mauris cursus mattis molestie. Nunc consequat interdum varius sit amet mattis vulputate enim. Egestas dui id ornare arcu odio ut sem. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Dignissim sodales ut eu sem. Mus mauris vitae ultricies leo integer malesuada nunc vel risus. Non tellus orci ac auctor augue mauris augue neque. Dui ut ornare lectus sit amet est placerat in. Tempus urna et pharetra pharetra massa massa ultricies mi. Nibh tellus molestie nunc non. Et ligula ullamcorper malesuada proin libero. Quis risus sed vulputate odio ut enim blandit volutpat."
            type="mine"
            position="last"
            timestamp="8:44 PM"
          ></Message>
          <Message
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi blandit cursus risus at ultrices mi tempus. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nibh tortor id aliquet lectus proin nibh nisl condimentum id. Vitae elementum curabitur vitae nunc sed velit dignissim sodales. Suscipit tellus mauris a diam. Et egestas quis ipsum suspendisse ultrices gravida dictum fusce. Suspendisse in est ante in nibh mauris cursus mattis molestie. Nunc consequat interdum varius sit amet mattis vulputate enim. Egestas dui id ornare arcu odio ut sem. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Dignissim sodales ut eu sem. Mus mauris vitae ultricies leo integer malesuada nunc vel risus. Non tellus orci ac auctor augue mauris augue neque. Dui ut ornare lectus sit amet est placerat in. Tempus urna et pharetra pharetra massa massa ultricies mi. Nibh tellus molestie nunc non. Et ligula ullamcorper malesuada proin libero. Quis risus sed vulputate odio ut enim blandit volutpat."
            type="mine"
            position="last"
            timestamp="8:44 PM"
          ></Message>
          <Message
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi blandit cursus risus at ultrices mi tempus. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nibh tortor id aliquet lectus proin nibh nisl condimentum id. Vitae elementum curabitur vitae nunc sed velit dignissim sodales. Suscipit tellus mauris a diam. Et egestas quis ipsum suspendisse ultrices gravida dictum fusce. Suspendisse in est ante in nibh mauris cursus mattis molestie. Nunc consequat interdum varius sit amet mattis vulputate enim. Egestas dui id ornare arcu odio ut sem. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Dignissim sodales ut eu sem. Mus mauris vitae ultricies leo integer malesuada nunc vel risus. Non tellus orci ac auctor augue mauris augue neque. Dui ut ornare lectus sit amet est placerat in. Tempus urna et pharetra pharetra massa massa ultricies mi. Nibh tellus molestie nunc non. Et ligula ullamcorper malesuada proin libero. Quis risus sed vulputate odio ut enim blandit volutpat."
            type="mine"
            position="last"
            timestamp="8:44 PM"
          ></Message>
          <Message
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Morbi blandit cursus risus at ultrices mi tempus. Porttitor rhoncus dolor purus non enim praesent elementum facilisis. Nibh tortor id aliquet lectus proin nibh nisl condimentum id. Vitae elementum curabitur vitae nunc sed velit dignissim sodales. Suscipit tellus mauris a diam. Et egestas quis ipsum suspendisse ultrices gravida dictum fusce. Suspendisse in est ante in nibh mauris cursus mattis molestie. Nunc consequat interdum varius sit amet mattis vulputate enim. Egestas dui id ornare arcu odio ut sem. Elit ut aliquam purus sit amet luctus venenatis lectus magna. Dignissim sodales ut eu sem. Mus mauris vitae ultricies leo integer malesuada nunc vel risus. Non tellus orci ac auctor augue mauris augue neque. Dui ut ornare lectus sit amet est placerat in. Tempus urna et pharetra pharetra massa massa ultricies mi. Nibh tellus molestie nunc non. Et ligula ullamcorper malesuada proin libero. Quis risus sed vulputate odio ut enim blandit volutpat."
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
