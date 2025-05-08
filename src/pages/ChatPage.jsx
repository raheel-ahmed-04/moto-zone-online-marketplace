import React, { useState } from "react";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, input]);
      setInput("");
    }
  };

  return (
    <div className="chatpage-container">
      <h2>Live Chat Support</h2>
      <div className="chatpage-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="chatpage-message">{msg}</div>
        ))}
      </div>
      <div className="chatpage-input">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;