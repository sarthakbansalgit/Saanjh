import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect("http://localhost:5001");

const Chat = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [user, setUser] = useState("");

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:5001/auth/getuser', {
                headers: {
                    "auth-token": localStorage.getItem('token')
                }
            });
            setUser(response.data.name);
            // Default room logic can be applied here
            setRoom("GlobalRoom");
            socket.emit("join_room", "GlobalRoom");
        } catch (error) {
            console.error(error);
        }
    }

    const joinRoom = (roomName) => {
        if (roomName !== "") {
            setRoom(roomName);
            socket.emit("join_room", roomName);
        }
    };

    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                room: room,
                author: user,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        return () => {
            socket.off("receive_message");
        }
    }, [socket]);

    return (
        <div className="main-panel" style={{ width: "100%" }}>
            <div className="content-wrapper glass-card">
                <h4 className="font-weight-bold text-dark text-center" style={{ fontFamily: "'Playfair Display', serif", color: "var(--deep-pink)" }}>Live Chat Match</h4>
                <p className="font-weight-normal mb-2 text-muted text-center">Connect instantly and chat live</p>

                <div className="chat-window mx-auto my-4" style={{ maxWidth: "600px", border: "1px solid var(--glass-border)", borderRadius: "10px", backgroundColor: "white", overflow: "hidden" }}>
                    <div className="chat-header" style={{ background: "linear-gradient(45deg, var(--primary-pink), var(--deep-pink))", padding: "15px", color: "white" }}>
                        <h5 className="m-0">Global Live Chat</h5>
                    </div>
                    <div className="chat-body" style={{ height: "300px", overflowY: "auto", padding: "20px", background: "#FAFAFA" }}>
                        {messageList.map((messageContent, idx) => {
                            return (
                                <div className="message" key={idx} style={{
                                    display: "flex",
                                    justifyContent: user === messageContent.author ? "flex-end" : "flex-start",
                                    marginBottom: "15px"
                                }}>
                                    <div style={{
                                        maxWidth: "70%",
                                        background: user === messageContent.author ? "var(--primary-pink)" : "#EAEAEA",
                                        color: user === messageContent.author ? "white" : "black",
                                        padding: "10px 15px",
                                        borderRadius: "15px",
                                        borderBottomRightRadius: user === messageContent.author ? "0" : "15px",
                                        borderBottomLeftRadius: user === messageContent.author ? "15px" : "0",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                                    }}>
                                        <p className="m-0">{messageContent.message}</p>
                                        <small style={{ fontSize: "10px", opacity: "0.7", display: "block", textAlign: "right", marginTop: "5px" }}>{messageContent.time} - {messageContent.author}</small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="chat-footer d-flex" style={{ padding: "10px", borderTop: "1px solid var(--glass-border)", background: "white" }}>
                        <input
                            type="text"
                            value={currentMessage}
                            placeholder="Hey..."
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => { e.key === "Enter" && sendMessage(); }}
                            style={{ flex: "1", border: "none", outline: "none", padding: "10px", borderRadius: "20px", background: "#FAFAFA" }}
                        />
                        <button onClick={sendMessage} style={{ background: "transparent", border: "none", color: "var(--primary-pink)", fontWeight: "bold", padding: "0 15px", cursor: "pointer" }}>&#9658;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
