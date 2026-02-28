import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import UserProfile from '../dashboard/UserProfile';

const AdminProfiles = () => {
    const [allusers, setAllusers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5001/auth/getusers')
            .then(response => setAllusers(response.data))
            .catch(error => console.error('Error fetching all users:', error));
    };

    const handleViewProfile = user => {
        setSelectedUser(user);
        setShowProfileModal(true);
    };

    const handleCloseProfileModal = () => {
        setSelectedUser(null);
        setShowProfileModal(false);
    };

    const deleteUser = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this user?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5001/auth/deleteuser/${userId}`);
            setAllusers(allusers.filter(user => user._id !== userId));
            alert("User deleted successfully.");
        } catch (error) {
            console.error('Error deleting user:', error);
            alert("Error deleting user.");
        }
    };

    const handleModerate = async (targetId, currentStatus) => {
        const newStatus = currentStatus === "blocked" ? "approved" : "blocked";
        const confirmMod = window.confirm(`Change user status to ${newStatus.toUpperCase()}?`);
        if (!confirmMod) return;

        try {
            const res = await axios.post(`http://localhost:5001/auth/admin/modstatus`, {
                targetId, targetStatus: newStatus
            });
            if (res.data.success) {
                alert(res.data.message);
                fetchUsers(); // Refresh the list
            }
        } catch (error) {
            console.error(error);
            alert("Error updating status.");
        }
    };

    const stats = {
        total: allusers.length,
        premium: allusers.filter(u => u.plan && u.plan !== "free").length,
        blocked: allusers.filter(u => u.status === "blocked").length
    };

    return (
        <>
            <div className="main-panel">
                <div className="content-wrapper">

                    {/* Header & Stats Banner */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4 className="font-weight-bold" style={{ color: "var(--deep-pink)", fontFamily: "'Playfair Display', serif" }}>Admin Moderation Console</h4>
                            <p className="font-weight-normal mb-2 text-muted">Manage all Saanjh Match registered accounts.</p>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="card" style={{ borderRadius: "15px", borderLeft: "5px solid var(--deep-pink)" }}>
                                <div className="card-body">
                                    <h6 className="text-muted">Total Registered</h6>
                                    <h2>{stats.total}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card" style={{ borderRadius: "15px", borderLeft: "5px solid #10b981" }}>
                                <div className="card-body">
                                    <h6 className="text-muted">Premium Members</h6>
                                    <h2>{stats.premium}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card" style={{ borderRadius: "15px", borderLeft: "5px solid #ef4444" }}>
                                <div className="card-body">
                                    <h6 className="text-muted">Blocked Accounts</h6>
                                    <h2>{stats.blocked}</h2>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="row">
                        <div className="col-12">
                            <div className="card" style={{ borderRadius: "20px", border: "none", boxShadow: "0 5px 20px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead style={{ background: "f8f9fa" }}>
                                                <tr>
                                                    <th>User</th>
                                                    <th>Email / Phone</th>
                                                    <th>Subscription</th>
                                                    <th>Status</th>
                                                    <th className="text-right">Admin Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allusers.map(all => (
                                                    <tr key={all._id} style={{ opacity: all.status === "blocked" ? 0.6 : 1 }}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <img src={`http://localhost:5001/${all.image || 'uploads/default.png'}`} alt="avatar" style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }} />
                                                                <div className="ms-3 ml-3">
                                                                    <p className="fw-bold mb-1" style={{ fontWeight: "bold", color: "var(--deep-pink)" }}>{all.name}</p>
                                                                    <p className="text-muted mb-0" style={{ fontSize: "12px" }}>{all.gender} • {all.age} yrs • {all.caste}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <p className="fw-normal mb-1">{all.email}</p>
                                                            <p className="text-muted mb-0" style={{ fontSize: "12px" }}>{all.phone}</p>
                                                        </td>
                                                        <td>
                                                            {(!all.plan || all.plan === 'free') ? (
                                                                <span className="badge rounded-pill bg-secondary px-3 py-2 text-white">Free</span>
                                                            ) : (
                                                                <span className="badge rounded-pill bg-success px-3 py-2 text-white" style={{ background: "#10b981" }}>⭐ {all.plan.toUpperCase()}</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {all.status === "blocked" ? (
                                                                <span className="badge rounded-pill bg-danger px-3 py-2 text-white" style={{ background: "#ef4444" }}>BLOCKED</span>
                                                            ) : (
                                                                <span className="badge rounded-pill bg-primary px-3 py-2 text-white" style={{ background: "#3b82f6" }}>APPROVED</span>
                                                            )}
                                                        </td>
                                                        <td className="text-right d-flex gap-2 justify-content-end">
                                                            <button className="btn btn-outline-info btn-sm m-1" style={{ borderRadius: "20px" }} onClick={() => handleViewProfile(all)}>View</button>

                                                            <button
                                                                className={`btn btn-sm m-1 text-white ${all.status === 'blocked' ? 'btn-success' : 'btn-warning'}`}
                                                                style={{ borderRadius: "20px" }}
                                                                onClick={() => handleModerate(all._id, all.status)}
                                                            >
                                                                {all.status === 'blocked' ? 'Unblock' : 'Block'}
                                                            </button>

                                                            <button className="btn btn-danger btn-sm m-1" style={{ borderRadius: "20px", background: "#ef4444", border: "none" }} onClick={() => deleteUser(all._id)}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {allusers.length === 0 && (
                                            <div className="text-center p-5">
                                                <h5 className="text-muted">No users found.</h5>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <Modal show={showProfileModal} onHide={handleCloseProfileModal} size="lg" centered>
                <Modal.Header closeButton style={{ background: "var(--primary-pink)", color: "white", border: "none" }}>
                    <Modal.Title style={{ fontFamily: "'Playfair Display', serif" }}>Profile View</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ padding: 0 }}>
                    {selectedUser && <UserProfile user={selectedUser} isFree={false} />}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AdminProfiles;