import React from "react";
import "./Message.css";

/*
Props:
    type - me if message is from myself, otherwise type is other
    text - contains message contents
    positon - determines if timestamp should be placed below message
    timestamp - timestamp of message
*/

const Message = (props) => {
  return (
    <div className={"Message" + " " + props.type}>
      <div className="bubble-container">
        <div className="bubble">
          <p>{props.text}</p>
        </div>
      </div>

      <div className={"timestamp" + " " + props.type}>
        {/* If it's the last message in a sequence put the timestamp below the message*/}
        {props.position == "last" ? (
          <>
            <p>{props.timestamp}</p>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Message;
