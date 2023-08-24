import React, {  useState } from "react";
import Inbox from "./Inbox";
import Chatbox from "./Chatbox";

const Sidebar = () => {
  const [showChatbox, setShowChatbox] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "grey" }}>
      <div
        style={{
          background: "#009788",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "calc(100vh - 40px)",
          margin: "20px",
        }}
      >
        <div
          style={{
            flex: "0 0 25%",
            background: "grey",
            borderRight: "1px solid #ccc",
          }}
        >
          <Inbox setShowChatbox={setShowChatbox} />
        </div>
        <div
          style={{
            flex: "1",
            background: "rgb(164 164 164)",
            borderLeft: "1px solid #ccc",
          }}
        >
          {showChatbox ? <Chatbox /> : <div>Select a conversation to start chatting.</div>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
