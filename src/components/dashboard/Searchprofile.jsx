import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import UserProfile from './UserProfile';
import { useNavigate } from 'react-router-dom';

const Searchprofile = () => {
    const navigate = useNavigate();

    const [allusers, setAllusers] = useState([]);
    const [me, setMe] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5001/auth/getusers')
            .then(response => setAllusers(response.data))
            .catch(error => console.error('Error fetching all users:', error));

        axios.get('http://localhost:5001/auth/getuser', {
            headers: { "auth-token": localStorage.getItem('token') }
        }).then(res => setMe(res.data)).catch(() => { });
    }, []);

    const handleViewProfile = user => {
        setSelectedUser(user);
        setShowProfileModal(true);
    };

    const isFree = !me?.plan || me?.plan === "free";

    const filtered = allusers.filter(u => {
        if (me && u.email === me.email) return false;
        const q = search.toLowerCase();
        return !q ||
            u.name?.toLowerCase().includes(q) ||
            u.caste?.toLowerCase().includes(q) ||
            u.state?.toLowerCase().includes(q) ||
            u.district?.toLowerCase().includes(q) ||
            u.religion?.toLowerCase().includes(q) ||
            u.education?.toLowerCase().includes(q);
    });

    return (
        <div className="main-panel" style={{ width: "100%" }}>
            <div className="content-wrapper">

                <div className="row mb-4 align-items-center">
                    <div className="col-12 col-md-8">
                        <h3 className="font-weight-bold" style={{ color: "var(--text-dark)", fontFamily: "'Playfair Display', serif" }}>
                            Search <span style={{ color: "var(--deep-pink)" }}>Profiles</span>
                        </h3>
                        <p className="text-muted mb-0">Find your perfect match by name, caste, location & more</p>
                    </div>
                    <div className="col-12 col-md-4 text-md-right mt-3 mt-md-0">
                        {isFree && (
                            <button className="btn" style={{ background: "linear-gradient(135deg, #fb6f92, #c9184a)", color: "white", borderRadius: "30px", padding: "10px 20px", fontWeight: "bold", boxShadow: "0 10px 20px rgba(251,111,146,0.4)" }} onClick={() => navigate('/pricing')}>
                                ⭐ Go Premium
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div style={{ position: "relative" }}>
                            <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Search by name, caste, state, religion, education..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: "100%", padding: "14px 20px 14px 50px", borderRadius: "50px", border: "2px solid var(--glass-border)", background: "rgba(255,255,255,0.9)", boxShadow: "0 5px 20px rgba(0,0,0,0.08)", fontSize: "15px", outline: "none" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <p style={{ color: "#888", marginBottom: "20px" }}>Showing <strong>{filtered.length}</strong> profiles</p>

                {/* Cards */}
                <div className="row">
                    {filtered.length === 0 && (
                        <div className="col-12 text-center py-5">
                            <h5 className="text-muted">No profiles found. Try a different search.</h5>
                        </div>
                    )}
                    {filtered.map(user => (
                        <div className="col-12 col-md-6 col-lg-4 mb-4" key={user._id}>
                            <div
                                style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(251,111,146,0.15)", transition: "transform 0.3s ease", border: "1px solid var(--glass-border)" }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ position: "relative" }}>
                                    <img
                                        src={`http://localhost:5001/${user.image || 'uploads/default.png'}`}
                                        alt={user.name}
                                        style={{ width: "100%", height: "220px", objectFit: "cover", filter: isFree ? "blur(8px)" : "none" }}
                                    />
                                    {isFree && (
                                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
                                            <span style={{ background: "rgba(0,0,0,0.6)", color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "12px" }}>🔒 Upgrade to view</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ padding: "18px" }}>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 style={{ margin: 0, color: "var(--deep-pink)", fontWeight: "bold", fontFamily: "'Playfair Display', serif" }}>
                                            {user.name}
                                        </h5>
                                        <span style={{ background: "var(--primary-pink)", color: "white", padding: "3px 10px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold" }}>
                                            {user.age} yrs
                                        </span>
                                    </div>
                                    <p style={{ margin: "0 0 3px 0", color: "#666", fontSize: "14px" }}>📍 {user.district || '—'}, {user.state || '—'}</p>
                                    <p style={{ margin: "0 0 3px 0", color: "#666", fontSize: "14px" }}>🛐 {user.religion || '—'} {user.caste ? `• ${user.caste}` : ''}</p>
                                    <p style={{ margin: "0 0 15px 0", color: "#666", fontSize: "14px" }}>🎓 {user.education || 'Not Specified'}</p>

                                    <button
                                        className="btn w-100"
                                        style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", borderRadius: "20px", fontWeight: "bold", border: "none", padding: "10px" }}
                                        onClick={() => handleViewProfile(user)}
                                    >
                                        View Full Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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

export default Searchprofile;