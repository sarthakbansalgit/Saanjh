import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Messages = () => {
    const [myUser, setMyUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeChatEmail, setActiveChatEmail] = useState(null);
    const [activeChatName, setActiveChatName] = useState("");
    const [conversation, setConversation] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatBodyRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:5001/auth/getuser', {
            headers: { "auth-token": localStorage.getItem("token") }
        }).then(res => setMyUser(res.data))
            .catch(err => console.error("Error fetching my user", err));

        fetchInbox();
    }, []);

    const fetchInbox = () => {
        axios.get('http://localhost:5001/auth/getmessages', {
            headers: { "auth-token": localStorage.getItem("token") }
        }).then(response => {
            const uniqueSenders = [];
            const inboxList = [];
            response.data.forEach(msg => {
                if (!uniqueSenders.includes(msg.from)) {
                    uniqueSenders.push(msg.from);
                    inboxList.push(msg);
                }
            });
            setMessages(inboxList);
        }).catch(error => console.error('Error fetching messages:', error));
    };

    const openChat = (email, name) => {
        setActiveChatEmail(email);
        setActiveChatName(name);
        fetchConversation(email);
    };

    const fetchConversation = (otherEmail) => {
        axios.get(`http://localhost:5001/auth/getconversation/${otherEmail}`, {
            headers: { "auth-token": localStorage.getItem("token") }
        }).then(res => {
            setConversation(res.data.messages);
            scrollToBottom();
        }).catch(err => console.error(err));
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatBodyRef.current) {
                chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
            }
        }, 100);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !myUser) return;
        axios.post('http://localhost:5001/auth/sendmail', {
            to: activeChatEmail,
            senderEmail: myUser.email,
            senderName: myUser.name,
            subject: "Reply",
            description: newMessage
        }).then(() => {
            setNewMessage("");
            fetchConversation(activeChatEmail);
        }).catch(() => alert("Error sending reply"));
    };

    const closeChat = () => {
        setActiveChatEmail(null);
        setConversation([]);
        fetchInbox();
    };

    return (
        <div className="main-panel" style={{ width: "100%" }}>
            <div className="content-wrapper">

                <div className="row mb-3">
                    <div className="col-12">
                        <h3 className="font-weight-bold" style={{ color: "var(--text-dark)", fontFamily: "'Playfair Display', serif" }}>
                            Your <span style={{ color: "var(--deep-pink)" }}>Inbox</span>
                        </h3>
                        <p className="text-muted">Click on a conversation to open a chat window and reply.</p>
                    </div>
                </div>

                <div className="row mt-2">
                    {messages.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <div style={{ fontSize: "60px", marginBottom: "20px" }}>💌</div>
                            <h5 className="text-muted">No messages yet. Send an interest to start a conversation!</h5>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div className="col-md-6 col-lg-4 my-3" key={msg._id} onClick={() => openChat(msg.from, msg.senderName)}>
                                <div style={{
                                    backgroundColor: "rgba(255,255,255,0.85)",
                                    padding: "20px",
                                    borderRadius: "18px",
                                    boxShadow: "0 5px 20px rgba(251,111,146,0.12)",
                                    cursor: "pointer",
                                    border: "1px solid var(--glass-border)",
                                    transition: "all 0.3s ease"
                                }}
                                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(251,111,146,0.25)'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 5px 20px rgba(251,111,146,0.12)'; }}
                                >
                                    <div className="d-flex align-items-center mb-2">
                                        <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: "18px", marginRight: "12px" }}>
                                            {(msg.senderName || "?")[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h6 style={{ color: "var(--deep-pink)", margin: 0, fontWeight: "bold" }}>{msg.senderName}</h6>
                                            <small className="text-muted">{msg.from}</small>
                                        </div>
                                    </div>
                                    <hr style={{ borderColor: "rgba(251,111,146,0.2)", margin: "10px 0" }} />
                                    <p className="text-truncate" style={{ margin: 0, opacity: 0.7, fontSize: "14px" }}>
                                        💬 {msg.subject === "Reply" ? msg.message : "Sent you a new message"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* Chat Popup Modal */}
            {activeChatEmail && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(5px)"
                }}>
                    <div style={{
                        width: "520px", maxWidth: "92%", height: "620px",
                        backgroundColor: "#fff",
                        borderRadius: "25px",
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
                        overflow: "hidden"
                    }}>
                        {/* Header */}
                        <div style={{
                            background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))",
                            padding: "20px 25px", color: "white",
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div>
                                <h5 style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>Chat with {activeChatName}</h5>
                                <small style={{ opacity: 0.8 }}>{activeChatEmail}</small>
                            </div>
                            <button onClick={closeChat} style={{
                                background: "rgba(255,255,255,0.25)", border: "none", color: "white",
                                width: "35px", height: "35px", borderRadius: "50%", fontSize: "16px",
                                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                            }}>✕</button>
                        </div>

                        {/* Message Body */}
                        <div ref={chatBodyRef} style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#fdf8f9" }}>
                            {conversation.length === 0 && (
                                <p className="text-center text-muted mt-5">No messages yet. Say hello! 👋</p>
                            )}
                            {conversation.map((cMsg, index) => {
                                const isMe = cMsg.from === myUser?.email;
                                return (
                                    <div key={index} style={{
                                        display: "flex",
                                        justifyContent: isMe ? "flex-end" : "flex-start",
                                        marginBottom: "15px"
                                    }}>
                                        <div style={{
                                            maxWidth: "75%",
                                            background: isMe ? "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))" : "#fff",
                                            color: isMe ? "white" : "#333",
                                            padding: "12px 18px",
                                            borderRadius: "20px",
                                            borderBottomRightRadius: isMe ? "4px" : "20px",
                                            borderBottomLeftRadius: isMe ? "20px" : "4px",
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
                                            border: isMe ? "none" : "1px solid #eee"
                                        }}>
                                            <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.5" }}>{cMsg.message || cMsg.subject}</p>
                                            <small style={{ display: "block", textAlign: isMe ? "right" : "left", marginTop: "5px", fontSize: "10px", opacity: 0.7 }}>
                                                {new Date(cMsg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Input Footer */}
                        <div style={{ padding: "15px 20px", borderTop: "1px solid #eee", backgroundColor: "#fff", display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                                placeholder="Type a message..."
                                style={{ flex: 1, border: "2px solid var(--primary-pink)", borderRadius: "25px", padding: "10px 20px", outline: "none", backgroundColor: "#fafafa" }}
                            />
                            <button onClick={handleSendMessage} style={{
                                background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))",
                                border: "none", color: "white",
                                borderRadius: "25px", padding: "0 25px",
                                fontWeight: "bold", cursor: "pointer",
                                boxShadow: "0 4px 15px rgba(251,111,146,0.4)"
                            }}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
