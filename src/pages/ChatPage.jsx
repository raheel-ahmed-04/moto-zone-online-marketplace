import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const ChatPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [input, setInput] = useState("");
  const userRole = sessionStorage.getItem("role") || "buyer"; // Default to buyer for testing
  const userName = sessionStorage.getItem("userName") || "Raheel Ahmed"; // Default for testing
  const userId = 1; // Dummy user ID for current user (Raheel Ahmed)

  // Dummy data
  const dummyUsers = [
    { id: 6, name: "Raheel Ahmed", role: "seller" },
    { id: 2, name: "Ahad Ur Rehman", role: "seller" },
    { id: 3, name: "Bilal Arshad", role: "seller" },
    { id: 4, name: "Sara Wilson", role: "seller" },
    { id: 5, name: "Jane Smith", role: "buyer" },
  ];

  const dummyMessages = [
    {
      id: 7,
      senderId: 1,
      receiverId: 6,
      content: "Hi, is the Helmet you were selling still available?",
      timestamp: "2025-05-07T11:05:00Z",
    },
    {
      id: 8,
      senderId: 6,
      receiverId: 1,
      content: "Yes, Are you interested?",
      timestamp: "2025-05-07T11:05:00Z",
    },
    {
      id: 1,
      senderId: 1,
      receiverId: 2,
      content: "Hi, is the bike still available?",
      timestamp: "2025-05-07T10:00:00Z",
    },
    {
      id: 2,
      senderId: 2,
      receiverId: 1,
      content: "Yes, it's available! Want to see it?",
      timestamp: "2025-05-07T10:05:00Z",
    },
    {
      id: 3,
      senderId: 1,
      receiverId: 2,
      content: "Great! Can I come by tomorrow?",
      timestamp: "2025-05-07T10:10:00Z",
    },
    {
      id: 4,
      senderId: 2,
      receiverId: 1,
      content: "Sure, tomorrow at 2 PM works.",
      timestamp: "2025-05-07T10:15:00Z",
    },
    {
      id: 5,
      senderId: 1,
      receiverId: 3,
      content: "Is the car in good condition?",
      timestamp: "2025-05-07T11:00:00Z",
    },
    {
      id: 6,
      senderId: 3,
      receiverId: 1,
      content: "Yes, it's in great shape. Want to test drive?",
      timestamp: "2025-05-07T11:05:00Z",
    },
  ];

  // Derive contacts based on user role
  const getContacts = useMemo(() => {
    const contacts = new Set();
    dummyMessages.forEach((msg) => {
      if (userRole === "buyer" && msg.senderId === userId) {
        // Buyer sees sellers they've messaged
        const seller = dummyUsers.find(
          (u) => u.id === msg.receiverId && u.role === "seller"
        );
        if (seller) contacts.add(JSON.stringify(seller));
      } else if (userRole === "seller" && msg.receiverId === userId) {
        // Seller sees buyers who messaged them
        const buyer = dummyUsers.find(
          (u) => u.id === msg.senderId && u.role === "buyer"
        );
        if (buyer) contacts.add(JSON.stringify(buyer));
      }
    });
    return Array.from(contacts).map((c) => JSON.parse(c));
  }, [userRole, userId, dummyMessages]);

  // Set default selected contact
  useEffect(() => {
    if (getContacts.length > 0 && !selectedContact) {
      setSelectedContact(getContacts[0]);
    } else if (getContacts.length === 0) {
      setSelectedContact(null);
    }
  }, [getContacts]);

  // Get messages for the selected contact
  const getMessages = () => {
    if (!selectedContact) return [];
    return dummyMessages.filter(
      (msg) =>
        (msg.senderId === userId && msg.receiverId === selectedContact.id) ||
        (msg.senderId === selectedContact.id && msg.receiverId === userId)
    );
  };

  const messages = getMessages();

  // Placeholder for sending messages (non-functional)
  const handleSend = () => {
    // Will be implemented with database later
    setInput("");
  };

  return (
    <div className="flex h-[70vh] bg-gray-100">
      {/* Left: Contact List */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {userRole === "buyer" ? "Sellers" : "Buyers"}
          </h2>
        </div>
        {getContacts.length === 0 ? (
          <div className="p-4 text-gray-500">No contacts yet</div>
        ) : (
          getContacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${
                selectedContact?.id === contact.id ? "bg-gray-200" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                {contact.name[0]}
              </div>
              <div>
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-500">{contact.role}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right: Active Chat */}
      <div className="w-2/3 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">
                {selectedContact.name[0]}
              </div>
              <div>
                <div className="font-medium">{selectedContact.name}</div>
                <div className="text-sm text-gray-500">
                  {selectedContact.role}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderId === userId ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.senderId === userId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div className="text-xs mt-1 opacity-75">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
