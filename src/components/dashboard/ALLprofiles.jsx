import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';

const ALLprofiles = () => {
    const navigate = useNavigate();

    const [allusers, setAllusers] = useState([]);
    const [me, setMe] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    // Filters
    const [genderFilter, setGenderFilter] = useState('');
    const [minAge, setMinAge] = useState('');
    const [maxAge, setMaxAge] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    useEffect(() => {
        getUser();
        getUsersList();
    }, []);

    const getUser = async () => {
        try {
            const res = await axios.get('http://localhost:5001/auth/getuser', {
                headers: { "auth-token": localStorage.getItem('token') }
            });
            setMe(res.data);
            if (res.data.gender === "Male") setGenderFilter("Female");
            if (res.data.gender === "Female") setGenderFilter("Male");
        } catch (error) {
            console.error("Error fetching my user profile", error);
        }
    };

    const getUsersList = async () => {
        try {
            const res = await axios.get('http://localhost:5001/auth/getusers');
            setAllusers(res.data);
        } catch (error) {
            console.error('Error fetching all users:', error);
        }
    };

    const handleViewProfile = async (targetUser) => {
        if (!me) return alert("Please log in first");
        try {
            const res = await axios.post(`http://localhost:5001/auth/viewprofile/${targetUser._id}`, {}, {
                headers: { "auth-token": localStorage.getItem('token') }
            });
            if (res.data.success && res.data.allowed) {
                setSelectedUser(targetUser);
                setShowProfileModal(true);
            } else {
                alert(res.data.message || "Daily Free Limit Reached! Upgrade to Premium.");
            }
        } catch (err) {
            console.error("View Profile Error", err);
        }
    };

    const handleSendInterest = async (targetEmail) => {
        if (!me) return alert("Please log in first");
        try {
            const res = await axios.post(`http://localhost:5001/auth/sendinterest`, { targetEmail }, {
                headers: { "auth-token": localStorage.getItem('token') }
            });
            alert(res.data.message);
            getUser();
        } catch (err) {
            console.error(err);
            alert("Error sending interest.");
        }
    };

    const filteredUsers = allusers.filter(u => {
        if (me && u.email === me.email) return false;
        if (genderFilter && u.gender && u.gender.toLowerCase() !== genderFilter.toLowerCase()) return false;
        if (minAge && u.age && parseInt(u.age) < parseInt(minAge)) return false;
        if (maxAge && u.age && parseInt(u.age) > parseInt(maxAge)) return false;
        if (cityFilter && u.district && !u.district.toLowerCase().includes(cityFilter.toLowerCase())) return false;
        return true;
    });

    const isFree = !me?.plan || me?.plan === "free";

    return (
        <div className="main-panel" style={{ width: "100%" }}>
            <div className="content-wrapper">

                {/* Header Section */}
                <div className="row mb-4 align-items-center">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                        <h3 className="font-weight-bold" style={{ color: "var(--text-dark)", fontFamily: "'Playfair Display', serif" }}>
                            Welcome, <span style={{ color: "var(--deep-pink)" }}>{me?.name || 'Guest'}</span>
                        </h3>
                        <p className="text-muted">Discover Your Perfect Match Today</p>
                    </div>
                    <div className="col-12 col-md-6 text-md-right">
                        {isFree && (
                            <button className="btn" style={{ background: "linear-gradient(135deg, #fb6f92, #c9184a)", color: "white", borderRadius: "30px", padding: "10px 20px", fontWeight: "bold", boxShadow: "0 10px 20px rgba(251,111,146,0.4)" }} onClick={() => navigate('/pricing')}>
                                ⭐ Upgrade to Premium
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: "20px", padding: "20px", border: "1px solid var(--glass-border)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", display: "flex", flexWrap: "wrap", gap: "15px", alignItems: "center" }}>
                            <h6 style={{ margin: 0, color: "var(--deep-pink)", fontWeight: "bold", width: "100%" }}>Filters:</h6>

                            <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} style={{ padding: "8px 15px", borderRadius: "15px", border: "1px solid #ddd", background: "#fff", flex: 1, minWidth: "150px" }}>
                                <option value="">Any Gender</option>
                                <option value="Male">Looking for Groom</option>
                                <option value="Female">Looking for Bride</option>
                            </select>

                            <input type="number" placeholder="Min Age" value={minAge} onChange={(e) => setMinAge(e.target.value)} style={{ padding: "8px 15px", borderRadius: "15px", border: "1px solid #ddd", background: "#fff", flex: 1, minWidth: "100px" }} />
                            <input type="number" placeholder="Max Age" value={maxAge} onChange={(e) => setMaxAge(e.target.value)} style={{ padding: "8px 15px", borderRadius: "15px", border: "1px solid #ddd", background: "#fff", flex: 1, minWidth: "100px" }} />
                            <input type="text" placeholder="City/District" value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} style={{ padding: "8px 15px", borderRadius: "15px", border: "1px solid #ddd", background: "#fff", flex: 2, minWidth: "200px" }} />
                        </div>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="row">
                    {filteredUsers.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <h5 className="text-muted">No profiles found matching your filters.</h5>
                        </div>
                    )}
                    {filteredUsers.map(userCard => {
                        const imgStyle = {
                            width: "100%", height: "230px", objectFit: "cover",
                            borderRadius: "20px 20px 0 0",
                            filter: isFree ? "blur(8px)" : "none",
                            transition: "all 0.3s ease"
                        };

                        const hasSent = me?.interestsSent?.includes(userCard.email);
                        const hasReceived = me?.interestsReceived?.includes(userCard.email);
                        const isMatched = me?.matches?.includes(userCard.email);

                        return (
                            <div className="col-12 col-md-6 col-lg-4 mb-4" key={userCard._id}>
                                <div
                                    style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(251,111,146,0.15)", transition: "transform 0.3s ease", border: "1px solid var(--glass-border)", position: "relative" }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {isMatched && (
                                        <div style={{ position: "absolute", top: "15px", right: "-30px", background: "#10b981", color: "white", padding: "5px 40px", transform: "rotate(45deg)", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>MATCHED</div>
                                    )}

                                    <div style={{ position: "relative" }}>
                                        <img src={`http://localhost:5001/${userCard.image || 'uploads/default.png'}`} alt={userCard.name} style={imgStyle} />
                                        {isFree && (
                                            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                                                <span style={{ background: "rgba(0,0,0,0.6)", color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "12px" }}>🔒 Upgrade to view photo</span>
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ padding: "20px" }}>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 style={{ margin: 0, color: "var(--deep-pink)", fontWeight: "bold", fontFamily: "'Playfair Display', serif", fontSize: "20px" }}>
                                                {userCard.name}
                                            </h5>
                                            <span style={{ background: "var(--primary-pink)", color: "white", padding: "3px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
                                                {userCard.age} yrs
                                            </span>
                                        </div>

                                        <p style={{ margin: "0 0 4px 0", color: "#666", fontSize: "14px" }}>📍 {userCard.district || '—'}, {userCard.state || '—'}</p>
                                        <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>💼 {userCard.working || 'Not Specified'} • {userCard.education || 'Not Specified'}</p>

                                        <div className="d-flex justify-content-between pt-3" style={{ borderTop: "1px solid #eee" }}>
                                            <button
                                                className="btn btn-sm"
                                                style={{ borderRadius: "20px", padding: "6px 16px", fontWeight: "bold", border: "2px solid var(--deep-pink)", color: "var(--deep-pink)", background: "white" }}
                                                onClick={() => handleViewProfile(userCard)}
                                            >
                                                View Profile
                                            </button>

                                            {!isMatched ? (
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ background: hasSent ? "#ccc" : "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", borderRadius: "20px", padding: "6px 16px", fontWeight: "bold", border: "none" }}
                                                    onClick={() => handleSendInterest(userCard.email)}
                                                    disabled={hasSent}
                                                >
                                                    {hasReceived ? "✅ Accept Interest" : (hasSent ? "✓ Interest Sent" : "💌 Send Interest")}
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ background: "#10b981", color: "white", borderRadius: "20px", padding: "6px 16px", fontWeight: "bold", border: "none" }}
                                                    onClick={() => navigate('/messages')}
                                                >
                                                    💬 Message
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", border: "none" }}>
                    <Modal.Title style={{ fontFamily: "'Playfair Display', serif" }}>{selectedUser?.name}'s Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    {selectedUser && <UserProfile user={selectedUser} isFree={isFree} />}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ALLprofiles;