import API from '../../api';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
    const navigate = useNavigate();
    const [myUser, setMyUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [activeChatEmail, setActiveChatEmail] = useState(null);
    const [activeChatName, setActiveChatName] = useState("");
    const [conversation, setConversation] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isPremium, setIsPremium] = useState(false);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        axios.get(`${API}/auth/getuser`, {
            headers: { "auth-token": localStorage.getItem("token") }
        }).then(res => {
            setMyUser(res.data);
            const active = res.data.plan &&
                res.data.plan !== 'free' &&
                res.data.planExpiry &&
                new Date() < new Date(res.data.planExpiry);
            setIsPremium(!!active);
            if (active) fetchInbox();
        }).catch(err => console.error("Error fetching user", err));
    }, []); // eslint-disable-line

    const fetchInbox = () => {
        axios.get(`${API}/auth/getmessages`, {
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
        }).catch(err => console.error('Error fetching messages:', err));
    };

    const openChat = (email, name) => {
        setActiveChatEmail(email);
        setActiveChatName(name);
        fetchConversation(email);
    };

    const fetchConversation = (otherEmail) => {
        axios.get(`${API}/auth/getconversation/${otherEmail}`, {
            headers: { "auth-token": localStorage.getItem("token") }
        }).then(res => {
            setConversation(res.data.messages);
            scrollToBottom();
        }).catch(err => console.error(err));
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatBodyRef.current)
                chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }, 100);
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !myUser) return;
        axios.post(`${API}/auth/sendmail`, {
            to: activeChatEmail,
            senderEmail: myUser.email,
            senderName: myUser.name,
            subject: "Reply",
            description: newMessage
        }, { headers: { "auth-token": localStorage.getItem("token") } })
            .then(() => { setNewMessage(""); fetchConversation(activeChatEmail); })
            .catch(err => {
                const msg = err.response?.data?.message || "Error sending reply";
                alert(msg);
            });
    };

    const closeChat = () => {
        setActiveChatEmail(null);
        setConversation([]);
        fetchInbox();
    };

    // ── Premium Wall ──────────────────────────────────────────────────────────
    if (!isPremium) {
        return (
            <div className="main-panel" style={{ width: "100%" }}>
                <div className="content-wrapper">
                    <div style={{ textAlign: "center", paddingTop: "60px", paddingBottom: "40px" }}>
                        <div style={{ fontSize: "80px", marginBottom: "20px" }}>💎</div>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--deep-pink)" }}>
                            Premium Feature
                        </h2>
                        <p className="text-muted mb-4" style={{ fontSize: "16px", maxWidth: "400px", margin: "0 auto 30px" }}>
                            Messaging is available exclusively for <strong>Premium members</strong> who are matched with each other.
                        </p>

                        {/* Plan cards */}
                        <div className="row justify-content-center" style={{ gap: "0" }}>
                            {[
                                { name: "7 Days", price: "₹199", tier: "7days", features: ["Chat after match", "5 interests/day", "View full photos"], color: "#6366f1" },
                                { name: "1 Month", price: "₹499", tier: "1month", features: ["Unlimited chat", "Unlimited interests", "Contact access"], color: "var(--deep-pink)", popular: true },
                                { name: "6 Months", price: "₹1999", tier: "6months", features: ["All premium features", "Priority visibility", "Best value!"], color: "#f59e0b" },
                            ].map(plan => (
                                <div className="col-12 col-md-4 mb-4 px-3" key={plan.tier}>
                                    <div style={{
                                        background: "#fff", borderRadius: "20px", padding: "30px 25px",
                                        boxShadow: plan.popular ? `0 15px 40px ${plan.color}33` : "0 5px 20px rgba(0,0,0,0.08)",
                                        border: `2px solid ${plan.popular ? plan.color : "#eee"}`,
                                        position: "relative", transform: plan.popular ? "scale(1.05)" : "scale(1)"
                                    }}>
                                        {plan.popular && (
                                            <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: plan.color, color: "white", padding: "4px 18px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                                                MOST POPULAR
                                            </div>
                                        )}
                                        <h4 style={{ color: plan.color, fontWeight: "bold" }}>{plan.name}</h4>
                                        <h2 style={{ color: "#1a1a2e", fontWeight: "900", margin: "10px 0 20px" }}>{plan.price}</h2>
                                        <ul style={{ listStyle: "none", padding: 0, marginBottom: "25px" }}>
                                            {plan.features.map(f => (
                                                <li key={f} style={{ padding: "6px 0", color: "#555", fontSize: "14px" }}>✅ {f}</li>
                                            ))}
                                        </ul>
                                        <button
                                            style={{ background: plan.color, color: "white", border: "none", borderRadius: "25px", padding: "12px 30px", fontWeight: "bold", width: "100%", cursor: "pointer" }}
                                            onClick={() => navigate('/pricing')}
                                        >
                                            Get {plan.name}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Full Messages UI (Premium users only) ─────────────────────────────────
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
                            <h5 className="text-muted">No messages yet. Get matched and start chatting!</h5>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div className="col-md-6 col-lg-4 my-3" key={msg._id} onClick={() => openChat(msg.from, msg.senderName)}>
                                <div style={{
                                    backgroundColor: "rgba(255,255,255,0.85)",
                                    padding: "20px", borderRadius: "18px",
                                    boxShadow: "0 5px 20px rgba(251,111,146,0.12)",
                                    cursor: "pointer", border: "1px solid var(--glass-border)", transition: "all 0.3s ease"
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
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
                    display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(5px)"
                }}>
                    <div style={{ width: "520px", maxWidth: "92%", height: "620px", backgroundColor: "#fff", borderRadius: "25px", display: "flex", flexDirection: "column", boxShadow: "0 30px 60px rgba(0,0,0,0.25)", overflow: "hidden" }}>
                        <div style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", padding: "20px 25px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <h5 style={{ margin: 0, fontFamily: "'Playfair Display', serif" }}>Chat with {activeChatName}</h5>
                                <small style={{ opacity: 0.8 }}>{activeChatEmail}</small>
                            </div>
                            <button onClick={closeChat} style={{ background: "rgba(255,255,255,0.25)", border: "none", color: "white", width: "35px", height: "35px", borderRadius: "50%", fontSize: "16px", cursor: "pointer" }}>✕</button>
                        </div>

                        <div ref={chatBodyRef} style={{ flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#fdf8f9" }}>
                            {conversation.length === 0 && <p className="text-center text-muted mt-5">No messages yet. Say hello! 👋</p>}
                            {conversation.map((cMsg, index) => {
                                const isMe = cMsg.from === myUser?.email;
                                return (
                                    <div key={index} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: "15px" }}>
                                        <div style={{ maxWidth: "75%", background: isMe ? "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))" : "#fff", color: isMe ? "white" : "#333", padding: "12px 18px", borderRadius: "20px", borderBottomRightRadius: isMe ? "4px" : "20px", borderBottomLeftRadius: isMe ? "20px" : "4px", boxShadow: "0 4px 10px rgba(0,0,0,0.07)", border: isMe ? "none" : "1px solid #eee" }}>
                                            <p style={{ margin: 0, fontSize: "15px", lineHeight: "1.5" }}>{cMsg.message || cMsg.subject}</p>
                                            <small style={{ display: "block", textAlign: isMe ? "right" : "left", marginTop: "5px", fontSize: "10px", opacity: 0.7 }}>
                                                {new Date(cMsg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ padding: "15px 20px", borderTop: "1px solid #eee", backgroundColor: "#fff", display: "flex", gap: "10px" }}>
                            <input
                                type="text" value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                                placeholder="Type a message..."
                                style={{ flex: 1, border: "2px solid var(--primary-pink)", borderRadius: "25px", padding: "10px 20px", outline: "none", backgroundColor: "#fafafa" }}
                            />
                            <button onClick={handleSendMessage} style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", border: "none", color: "white", borderRadius: "25px", padding: "0 25px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 15px rgba(251,111,146,0.4)" }}>Send</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
