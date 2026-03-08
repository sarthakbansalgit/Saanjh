import React, { useState } from 'react';
import axios from 'axios';
import Reset from './Reset';
import logo from '../saanjh-logo.jpg';
import Navbar from './fcomponents/Navbar';

const Forget = () => {
    const [creds, setCreds] = useState({ email: "" });
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState(""); // 'success' | 'error'
    const [myform, setForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5001/auth/email-send', { email: creds.email }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (data.success) {
                setForm(true);
                setMsg("OTP sent! Check your email.");
                setMsgType("success");
            } else {
                setMsg(data.error || "Email not found.");
                setMsgType("error");
            }
        } catch (error) {
            setMsg("Email doesn't exist or server error.");
            setMsgType("error");
        }
    };

    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Navbar />
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat fixed" }}>
                {!myform ? (
                    <div style={{ width: "100%", maxWidth: "420px", margin: "0 20px" }}>
                        <div style={{ borderRadius: "30px", overflow: "hidden", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>

                            {/* Header */}
                            <div className="text-center py-4" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white" }}>
                                <img src={logo} alt="Saanjh" style={{ height: "75px", objectFit: "contain", marginBottom: "10px" }} />
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", margin: 0 }}>Forgot Password?</h2>
                                <p className="mb-0 mt-1" style={{ opacity: 0.85 }}>We'll send you a reset code</p>
                            </div>

                            <div className="p-4 p-md-5">
                                {msg && (
                                    <div className={`alert alert-${msgType === 'success' ? 'success' : 'danger'} text-center`} style={{ borderRadius: "12px", fontSize: "14px" }}>
                                        {msg}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} id="my-form">
                                    <div className="mb-4">
                                        <label style={{ fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={creds.email}
                                            onChange={onChange}
                                            required
                                            placeholder="Enter your registered email"
                                            className="form-control"
                                            style={{ borderRadius: "12px", padding: "12px 16px", border: "1.5px solid #ddd", fontSize: "15px" }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn w-100"
                                        style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", borderRadius: "25px", padding: "13px", fontWeight: "bold", border: "none", boxShadow: "0 8px 20px rgba(251,111,146,0.4)", fontSize: "16px" }}
                                    >
                                        Send Reset Code
                                    </button>
                                    <p className="text-center mt-3" style={{ fontSize: "14px", color: "#666" }}>
                                        Remember password? <a href="/login" style={{ color: "var(--deep-pink)", fontWeight: "600" }}>Login</a>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Reset email={creds.email} />
                )}
            </div>
        </>
    );
};

export default Forget;