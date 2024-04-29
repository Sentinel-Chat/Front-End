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
  const timestamp_string = props.timestamp;
  const timestamp = new Date(timestamp_string);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const time_string = timestamp.toLocaleString("en-US", options);

  return (
    <div className={"Message" + " " + props.type}>
      <div className="bubble-container">
        <div className="bubble">{props.text}</div>
      </div>

      <div className={"timestamp" + " " + props.type}>
        {/* If it's the last message in a sequence put the timestamp below the message*/}
        {props.position === "last" ? (
          <>
            <p>
              {time_string} From {props.sender}
            </p>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Message;
