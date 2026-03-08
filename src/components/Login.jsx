import API from '../api';
import React, { useState } from 'react';
import Navbar from './fcomponents/Navbar';
import Footer from './fcomponents/Footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import logo from '../saanjh-logo.jpg';

const Login = () => {
    const [creds, setCreds] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const onChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await axios.post(`${API}/auth/login`, creds, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (data.success) {
                localStorage.setItem('token', data.authToken);
                window.location.href = "/";
            } else {
                setErrorMsg(data.error);
            }
        } catch (error) {
            setErrorMsg("Please check your database connection....");
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar />

            <div className="py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat fixed" }}>

                <div style={{ width: "100%", maxWidth: "450px", margin: "0 20px" }}>

                    <div style={{ borderRadius: "30px", overflow: "hidden", background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>

                        {/* Header Box */}
                        <div className="text-center py-4" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white" }}>
                            <img src={logo} alt="Saanjh" style={{ height: "80px", objectFit: "contain", marginBottom: "10px", filter: "brightness(1.05)" }} />
                            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", margin: 0 }}>Welcome Back</h2>
                            <p className="mb-0 mt-2" style={{ opacity: 0.9 }}>Sign in to continue your journey</p>
                        </div>

                        <div className="p-4 p-md-5">
                            {errorMsg && (
                                <div className="alert alert-danger text-center" style={{ borderRadius: "15px", fontSize: "14px" }}>
                                    {errorMsg}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-4">
                                    <label style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "8px", display: "block" }}>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={creds.email}
                                        onChange={onChange}
                                        required
                                        className="form-control"
                                        placeholder="Enter your email"
                                        style={{ borderRadius: "15px", padding: "12px 20px", border: "1px solid #ddd", background: "rgba(255,255,255,0.9)" }}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "8px", display: "block" }}>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={creds.password}
                                        onChange={onChange}
                                        required
                                        className="form-control"
                                        placeholder="Enter your password"
                                        style={{ borderRadius: "15px", padding: "12px 20px", border: "1px solid #ddd", background: "rgba(255,255,255,0.9)" }}
                                    />
                                </div>

                                <div className="d-flex justify-content-end mb-4">
                                    <Link to="/forget-password" style={{ fontSize: "14px", color: "var(--primary-pink)", textDecoration: "none", fontWeight: "bold" }}>
                                        Forgot password?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 mb-3"
                                    disabled={loading}
                                    style={{
                                        background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))",
                                        color: "white", borderRadius: "50px", padding: "12px",
                                        fontWeight: "bold", border: "none",
                                        boxShadow: "0 10px 20px rgba(251, 111, 146, 0.4)",
                                        fontSize: "16px"
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>

                                <div className="text-center mt-4">
                                    <p style={{ color: "var(--text-dark)", margin: 0 }}>
                                        Not a member? <Link to="/signup" style={{ color: "var(--deep-pink)", fontWeight: "bold", textDecoration: "none" }}>Register now</Link>
                                    </p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Login;