import API from '../api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../saanjh-logo.jpg';
import Navbar from './fcomponents/Navbar';
import Footer from './fcomponents/Footer';

const EmailAuth = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState(60);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        let interval;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleSendOtp = async (e) => {
        e?.preventDefault();

        // Basic email regex prefix check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await axios.post(`${API}/auth/send-otp`, { email });

            if (res.data.success) {
                setOtpSent(true);
                setTimer(60);
                setLoading(false);
            } else {
                setError(res.data.error || "Failed to send OTP.");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to send OTP. Please try again.");
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setError("Please enter a 6-digit OTP.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API}/auth/verify-otp`, { email, otp });

            if (res.data.success) {
                // Save verified email
                sessionStorage.setItem("verifiedEmail", email);
                navigate('/create-profile');
            } else {
                setError(res.data.error || "Invalid OTP.");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Invalid OTP. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", width: "100vw", background: `url('${process.env.PUBLIC_URL}/bg.jpeg') center/cover no-repeat fixed`, marginLeft: "calc(-50vw + 50%)" }}>

                <div className="wrapper" style={{ margin: "10px auto" }}>
                    <div style={{ borderRadius: "25px", overflow: "hidden" }}>

                        {/* Header */}
                        <div className="text-center py-4" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white" }}>
                            <img src={logo} alt="Saanjh" style={{ height: "75px", objectFit: "contain", marginBottom: "10px", filter: "brightness(1.05)" }} />
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", margin: 0 }}>Register</h2>
                            <p className="mb-0 mt-1" style={{ opacity: 0.85 }}>Verify your email to continue</p>
                        </div>

                        <div className="p-3 p-md-5">
                            {error && (
                                <div className="alert alert-danger text-center" style={{ borderRadius: "12px", fontSize: "14px" }}>
                                    {error}
                                </div>
                            )}

                            {!otpSent ? (
                                <form onSubmit={handleSendOtp}>
                                    <div className="mb-4">
                                        <label style={{ fontWeight: "600", color: "#333", marginBottom: "8px", display: "block" }}>Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text" style={{ background: "#f8f9fa", border: "1.5px solid #ddd", borderRight: "none", color: "#333" }}>
                                                <i className="fa-solid fa-envelope"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                                style={{ border: "1.5px solid #ddd", borderLeft: "none", padding: "12px", color: "#333", fontWeight: "600" }}
                                            />
                                        </div>
                                    </div>



                                    <button
                                        type="submit"
                                        className="btn w-100"
                                        disabled={!email || loading}
                                        style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", borderRadius: "25px", padding: "13px", fontWeight: "bold", border: "none", opacity: (!email || loading) ? 0.6 : 1, position: "relative" }}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Sending...
                                            </>
                                        ) : "Send OTP"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp}>
                                    <div className="mb-4">
                                        <label style={{ fontWeight: "600", color: "#333", marginBottom: "8px", display: "block", textAlign: "center" }}>Enter 6-digit OTP sent to<br /><strong style={{ color: "var(--deep-pink)" }}>{email}</strong></label>

                                        <input
                                            type="text"
                                            maxLength="6"
                                            className="form-control text-center mt-3"
                                            placeholder="• • • • • •"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            style={{ border: "1.5px solid #ddd", padding: "12px", fontSize: "24px", letterSpacing: "8px", color: "#333", fontWeight: "bold" }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 mb-3"
                                        disabled={otp.length !== 6 || loading}
                                        style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", borderRadius: "25px", padding: "13px", fontWeight: "bold", border: "none", opacity: (otp.length !== 6 || loading) ? 0.6 : 1 }}
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>

                                    <div className="text-center mt-3">
                                        {timer > 0 ? (
                                            <span style={{ color: "#666", fontSize: "14px" }}>Resend OTP in <b>{timer}s</b></span>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={loading}
                                                style={{ background: "none", border: "none", color: "var(--deep-pink)", fontWeight: "bold", textDecoration: "underline", fontSize: "14px" }}
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default EmailAuth;
