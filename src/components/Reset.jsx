import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../saanjh-logo.jpg';

const Reset = (props) => {
    const [creds, setCreds] = useState({ otp: "", password: "" });
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5001/auth/otp-verify', {
                email: props.email,
                password: creds.password,
                otp: creds.otp
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (data.success) {
                setMsg("✅ Password changed successfully! Redirecting...");
                setMsgType("success");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMsg(data.error || "Incorrect OTP.");
                setMsgType("error");
            }
        } catch (error) {
            setMsg("Incorrect OTP, please try again.");
            setMsgType("error");
        }
    };

    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ width: "100%", maxWidth: "420px", margin: "0 20px" }}>
            <div style={{ borderRadius: "30px", overflow: "hidden", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>

                {/* Header */}
                <div className="text-center py-4" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white" }}>
                    <img src={logo} alt="Saanjh" style={{ height: "75px", objectFit: "contain", marginBottom: "10px" }} />
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", margin: 0 }}>Reset Password</h2>
                    <p className="mb-0 mt-1" style={{ opacity: 0.85 }}>Enter the OTP sent to your email</p>
                </div>

                <div className="p-4 p-md-5">
                    {msg && (
                        <div className={`alert alert-${msgType === 'success' ? 'success' : 'danger'} text-center`} style={{ borderRadius: "12px", fontSize: "14px" }}>
                            {msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label style={{ fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>OTP Code</label>
                            <input
                                type="text"
                                name="otp"
                                value={creds.otp}
                                onChange={onChange}
                                required
                                placeholder="Enter OTP from email"
                                className="form-control text-center"
                                style={{ borderRadius: "12px", padding: "12px 16px", border: "1.5px solid #ddd", fontSize: "20px", letterSpacing: "6px", fontWeight: "bold" }}
                            />
                        </div>
                        <div className="mb-4">
                            <label style={{ fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>New Password</label>
                            <input
                                type="password"
                                name="password"
                                value={creds.password}
                                onChange={onChange}
                                required
                                placeholder="Enter new password (min 5 chars)"
                                className="form-control"
                                style={{ borderRadius: "12px", padding: "12px 16px", border: "1.5px solid #ddd", fontSize: "15px" }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn w-100"
                            style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", borderRadius: "25px", padding: "13px", fontWeight: "bold", border: "none", boxShadow: "0 8px 20px rgba(251,111,146,0.4)", fontSize: "16px" }}
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Reset;