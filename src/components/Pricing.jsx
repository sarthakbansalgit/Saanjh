import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './fcomponents/Navbar';
import Footer from './fcomponents/Footer';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleMockPayment = async (planTier, amount) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to purchase a membership!");
            navigate('/login');
            return;
        }

        // Mock Razorpay Flow
        const confirmPayment = window.confirm(`Proceed to secure payment of ₹${amount} for ${planTier} plan via Razorpay Mock?`);
        if (!confirmPayment) return;

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5001/auth/gopremium', { planTier }, {
                headers: { "auth-token": token }
            });

            if (res.data.success) {
                alert("🎉 Payment Successful! " + res.data.message);
                navigate('/');
            } else {
                alert("Payment processing failed.");
            }
        } catch (err) {
            console.error(err);
            alert("Error processing your payment.");
        }
        setLoading(false);
    };

    return (
        <div style={{ background: "#fafafa", minHeight: "100vh" }}>
            <Navbar />

            <div className="container py-5">
                <div className="text-center mb-5">
                    <h1 style={{ color: "var(--deep-pink)", fontFamily: "'Playfair Display', serif", fontWeight: "bold" }}>Choose Your Plan</h1>
                    <p className="text-muted" style={{ fontSize: "18px" }}>Unlock premium features to find your life partner faster.</p>
                </div>

                <div className="row justify-content-center">

                    {/* Free Plan */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="card h-100" style={{ borderRadius: "20px", border: "1px solid #ddd", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", transition: "transform 0.3s ease" }}>
                            <div className="card-body text-center p-4">
                                <h4 className="card-title text-muted mb-3">Free Plan</h4>
                                <h2 className="mb-4">₹0</h2>

                                <ul className="list-unstyled text-left" style={{ lineHeight: "2.5" }}>
                                    <li>✅ View up to 10 profiles/day</li>
                                    <li>✅ Create profile</li>
                                    <li>❌ Photos are blurred</li>
                                    <li>❌ No Direct Chat</li>
                                    <li>❌ No Contact Details</li>
                                </ul>

                                <button className="btn btn-outline-secondary w-100" style={{ borderRadius: "30px", marginTop: "20px" }} disabled>
                                    Current Default
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 7 Days Plan */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="card h-100" style={{ borderRadius: "20px", border: "2px solid var(--primary-pink)", boxShadow: "0 10px 20px rgba(251, 111, 146, 0.1)", transition: "transform 0.3s ease", position: "relative" }}>
                            <div className="card-body text-center p-4">
                                <h4 className="card-title mb-3" style={{ color: "var(--deep-pink)" }}>7 Days Access</h4>
                                <h2 className="mb-4">₹199</h2>

                                <ul className="list-unstyled text-left" style={{ lineHeight: "2.5" }}>
                                    <li>✅ See unblurred photos</li>
                                    <li>✅ 5 interests/day</li>
                                    <li>✅ Chat enabled (Mutual only)</li>
                                    <li>❌ No Contact Details</li>
                                </ul>

                                <button onClick={() => handleMockPayment('7days', 199)} className="btn w-100" style={{ background: "var(--primary-pink)", color: "white", borderRadius: "30px", marginTop: "20px", fontWeight: "bold" }} disabled={loading}>
                                    {loading ? 'Processing...' : 'Buy via Razorpay'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 1 Month Plan (Popular) */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="card h-100" style={{ borderRadius: "20px", border: "none", boxShadow: "0 20px 40px rgba(251, 111, 146, 0.3)", background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", transform: "scale(1.05)", zIndex: 10 }}>
                            <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "#f59e0b", color: "white", padding: "5px 20px", borderRadius: "20px", fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap", boxShadow: "0 5px 10px rgba(0,0,0,0.2)" }}>MOST POPULAR</div>
                            <div className="card-body text-center p-4">
                                <h4 className="card-title mb-3 text-white">1 Month Premium</h4>
                                <h2 className="mb-4">₹499</h2>

                                <ul className="list-unstyled text-left text-white" style={{ lineHeight: "2.5" }}>
                                    <li>✅ See unblurred photos</li>
                                    <li>✅ Unlimited interests</li>
                                    <li>✅ Unlimited Chat</li>
                                    <li>✅ View Contact Phone #s</li>
                                </ul>

                                <button onClick={() => handleMockPayment('1month', 499)} className="btn w-100 bg-white" style={{ color: "var(--deep-pink)", borderRadius: "30px", marginTop: "20px", fontWeight: "bold" }} disabled={loading}>
                                    {loading ? 'Processing...' : 'Buy via Razorpay'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 6 Months Plan */}
                    <div className="col-lg-3 col-md-6 mb-4">
                        <div className="card h-100" style={{ borderRadius: "20px", border: "2px solid #10b981", boxShadow: "0 10px 20px rgba(16, 185, 129, 0.1)", transition: "transform 0.3s ease" }}>
                            <div className="card-body text-center p-4">
                                <h4 className="card-title mb-3" style={{ color: "#059669" }}>6 Months Elite</h4>
                                <h2 className="mb-4">₹1999</h2>

                                <ul className="list-unstyled text-left" style={{ lineHeight: "2.5" }}>
                                    <li>✅ All Premium Features</li>
                                    <li>✅ Priority Search Visibility</li>
                                    <li>✅ Account Manager Assist</li>
                                </ul>

                                <button onClick={() => handleMockPayment('6months', 1999)} className="btn w-100" style={{ background: "#10b981", color: "white", borderRadius: "30px", marginTop: "20px", fontWeight: "bold" }} disabled={loading}>
                                    {loading ? 'Processing...' : 'Buy via Razorpay'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Pricing;
