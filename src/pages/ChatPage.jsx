import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { supabase } from "../../lib/supabase";
import "../styles/chat.css";

const ChatPage = () => {
  const socket = useRef(null);
  const messagesEndRef = useRef(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});

  const userRole = sessionStorage.getItem("role") || "buyer";
  const userName = sessionStorage.getItem("userName");
  const userId = parseInt(sessionStorage.getItem("userId"), 10);
  // Fetch contacts from Supabase
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, name, role")
          .neq("id", userId); // Exclude current user

        if (error) throw error;

        // Filter contacts based on role
        const filteredContacts = data.filter(
          (u) =>
            (userRole === "buyer" && u.role === "seller") ||
            (userRole === "seller" && u.role === "buyer")
        );

        setContacts(filteredContacts);
      } catch (err) {
        console.error("Error fetching contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchContacts();
    }
  }, [userId, userRole]);
  // Handle new message
  const handleNewMessage = (data) => {
    setMessages((prev) => [...prev, data]);
    // Only increment unread count if message is from someone else and not the selected contact
    if (data.senderId !== userId && data.senderId !== selectedContact?.id) {
      setUnreadCounts((prev) => ({
        ...prev,
        [data.senderId]: (prev[data.senderId] || 0) + 1,
      }));
    }
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // Setup socket connection and message handlers
  useEffect(() => {
    if (!userId || !userName) return;

    socket.current = io("http://localhost:5000");
    socket.current.emit("join", { userId, userName });

    // Listen for incoming messages
    socket.current.on("receive_message", handleNewMessage);

    // Listen for online users updates
    socket.current.on("users_update", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      if (socket.current) {
        socket.current.off("receive_message", handleNewMessage);
        socket.current.disconnect();
      }
    };
  }, [userId, userName, selectedContact?.id]); // Add selectedContact?.id as dependency
  // Fetch chat history from Supabase
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`senderId.eq.${userId},receiverId.eq.${userId}`)
          .order("timestamp", { ascending: true });

        if (error) throw error;
        setMessages(data);

        // Initialize unread counts from chat history
        const counts = {};
        data.forEach((msg) => {
          if (msg.senderId !== userId && msg.receiverId === userId) {
            counts[msg.senderId] = (counts[msg.senderId] || 0) + 1;
          }
        });
        setUnreadCounts(counts);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    };

    fetchChatHistory();
  }, [userId]);
  // Set default selected contact
  useEffect(() => {
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts]);

  // Filter messages for selected contact
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === userId && msg.receiverId === selectedContact?.id) ||
      (msg.senderId === selectedContact?.id && msg.receiverId === userId)
  );
  // Send message via socket and save to Supabase
  const handleSend = async () => {
    if (!input.trim() || !selectedContact) return;

    const newMessage = {
      senderId: userId,
      senderName: userName,
      receiverId: selectedContact.id,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      // Save message to Supabase
      const { error } = await supabase.from("messages").insert([newMessage]);

      if (error) throw error;

      // Send message through socket
      socket.current.emit("send_message", newMessage);
      setInput("");

      // Scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  // Handle contact selection and clear unread count
  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    setUnreadCounts((prev) => ({
      ...prev,
      [contact.id]: 0,
    }));
  };

  // Auto scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!userId || !userName) {
    return (
      <div className="empty-state">Please log in to use the chat feature.</div>
    );
  }

  return (
    <div className="chat-container">
      <div className="d-flex h-100">
        {/* Left: Contact List */}
        <div className="contacts-list col-4">
          <div className="chat-header">
            <h2 className="m-0">
              {userRole === "buyer" ? "Sellers" : "Buyers"}
            </h2>
          </div>{" "}
          {loading ? (
            <div className="empty-state">
              Loading contacts<span className="loading-dots"></span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="empty-state">No contacts available</div>
          ) : (
            contacts.map((contact) => {
              const isOnline = onlineUsers.some((u) => u.userId === contact.id);
              const unreadCount = unreadCounts[contact.id] || 0;
              return (
                <div
                  key={contact.id}
                  className={`contact-item d-flex align-items-center ${
                    selectedContact?.id === contact.id ? "active" : ""
                  }`}
                  onClick={() => handleContactSelect(contact)}
                >
                  <div className="contact-avatar">{contact.name[0]}</div>
                  <div className="flex-grow-1">
                    <div className="fw-bold">{contact.name}</div>
                    <div className="text-muted small">
                      {contact.role}
                      {isOnline && (
                        <span className="online-indicator ms-2"></span>
                      )}
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <div className="unread-indicator">{unreadCount}</div>
                  )}
                </div>
              );
            })
          )}
        </div>{" "}
        {/* Right: Chat Area */}
        <div className="col-8 d-flex flex-column h-100">
          {selectedContact ? (
            <>
              <div className="chat-header d-flex align-items-center">
                <div className="contact-avatar">{selectedContact.name[0]}</div>
                <div>
                  <div className="fw-bold">{selectedContact.name}</div>
                  <div className="text-muted small">
                    {selectedContact.role}
                    {onlineUsers.some(
                      (u) => u.userId === selectedContact.id
                    ) && <span className="online-indicator ms-2"></span>}
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {filteredMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${
                      msg.senderId === userId ? "sent" : "received"
                    }`}
                  >
                    <div>{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input">
                <div className="d-flex">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button onClick={handleSend} className="send-button">
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
