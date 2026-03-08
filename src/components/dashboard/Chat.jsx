import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect("http://localhost:5001");
const GLOBAL_ROOM = "GlobalRoom";

const Chat = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [user, setUser] = useState("");

    useEffect(() => {
        getUser();

        socket.emit("join_room", GLOBAL_ROOM);

        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, []); // eslint-disable-line

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:5001/auth/getuser', {
                headers: { "auth-token": localStorage.getItem('token') }
            });
            setUser(response.data.name);
        } catch (error) {
            console.error(error);
        }
    }

    const sendMessage = async () => {
        if (currentMessage.trim() !== "") {
            const messageData = {
                room: GLOBAL_ROOM,
                author: user,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + String(new Date(Date.now()).getMinutes()).padStart(2, '0')
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    return (
        <div className="main-panel" style={{ width: "100%" }}>
            <div className="content-wrapper">
                <div className="text-center mb-4">
                    <h3 style={{ fontFamily: "'Playfair Display', serif", color: "var(--deep-pink)" }}>Live Chat</h3>
                    <p className="text-muted">Connect instantly with others on Saanjh</p>
                </div>

                <div className="chat-window mx-auto" style={{ maxWidth: "650px", border: "1px solid var(--glass-border)", borderRadius: "20px", backgroundColor: "white", overflow: "hidden", boxShadow: "0 10px 30px rgba(251,111,146,0.15)" }}>
                    <div className="chat-header" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", padding: "18px 25px", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "12px", height: "12px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 8px #10b981" }}></div>
                        <h5 className="m-0" style={{ fontFamily: "'Playfair Display', serif" }}>Global Live Chat</h5>
                        <small style={{ opacity: 0.8, marginLeft: "auto" }}>Chatting as: {user || "..."}</small>
                    </div>

                    <div className="chat-body" style={{ height: "380px", overflowY: "auto", padding: "20px", background: "#fdf8f9" }}>
                        {messageList.length === 0 && (
                            <p className="text-center text-muted mt-5">No messages yet. Say hello! 👋</p>
                        )}
                        {messageList.map((messageContent, idx) => (
                            <div className="message" key={idx} style={{
                                display: "flex",
                                justifyContent: user === messageContent.author ? "flex-end" : "flex-start",
                                marginBottom: "15px"
                            }}>
                                <div style={{
                                    maxWidth: "70%",
                                    background: user === messageContent.author ? "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))" : "#fff",
                                    color: user === messageContent.author ? "white" : "#333",
                                    padding: "12px 18px",
                                    borderRadius: "20px",
                                    borderBottomRightRadius: user === messageContent.author ? "4px" : "20px",
                                    borderBottomLeftRadius: user === messageContent.author ? "20px" : "4px",
                                    boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                                    border: user === messageContent.author ? "none" : "1px solid #eee"
                                }}>
                                    <p className="m-0" style={{ fontSize: "15px", lineHeight: "1.4" }}>{messageContent.message}</p>
                                    <small style={{ fontSize: "10px", opacity: 0.7, display: "block", textAlign: user === messageContent.author ? "right" : "left", marginTop: "5px" }}>
                                        {messageContent.time} — {messageContent.author}
                                    </small>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="chat-footer d-flex" style={{ padding: "15px 20px", borderTop: "1px solid #eee", background: "white", gap: "10px" }}>
                        <input
                            type="text"
                            value={currentMessage}
                            placeholder="Type a message..."
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => { e.key === "Enter" && sendMessage(); }}
                            style={{ flex: "1", border: "2px solid var(--primary-pink)", outline: "none", padding: "10px 20px", borderRadius: "25px", background: "#fafafa" }}
                        />
                        <button onClick={sendMessage} style={{
                            background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))",
                            border: "none", color: "white", fontWeight: "bold",
                            padding: "10px 25px", borderRadius: "25px", cursor: "pointer",
                            boxShadow: "0 4px 15px rgba(251,111,146,0.4)"
                        }}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
