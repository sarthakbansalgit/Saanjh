import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Myprofile = () => {

    const [user, setUser] = useState({
        name: "", age: "", phone: "", caste: "", education: "", working: "",
        dob: "", state: "", email: "", image: "", district: "", height: "", weight: "", description: "", gender: ""
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        getUser();
    }, []);

    async function getUser() {
        try {
            const response = await axios.get('http://localhost:5001/auth/getuser', {
                headers: { "auth-token": localStorage.getItem('token') }
            });
            setUser(response.data);
            setFormData(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageChange = (event) => setSelectedImage(event.target.files[0]);

    const handleImageUpload = async () => {
        if (!selectedImage) return;
        const uploadData = new FormData();
        uploadData.append('image', selectedImage);

        try {
            const response = await axios.post('http://localhost:5001/auth/uploadimage', uploadData, {
                headers: {
                    "auth-token": localStorage.getItem('token'),
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.success) {
                alert(response.data.message);
                localStorage.setItem('isUpload', 'true');
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put('http://localhost:5001/auth/updateuser', formData, {
                headers: { "auth-token": localStorage.getItem('token') }
            });
            if (response.data.success) {
                setUser(response.data.user);
                setEditMode(false);
                alert("Profile Updated Successfully!");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating profile");
        }
    };

    return (
        <div className="main-panel" style={{ width: "100%" }}>
            <div className="content-wrapper">
                <div className="row align-items-center mb-4">
                    <div className="col-sm-8 mb-4 mb-xl-0">
                        <h4 className="font-weight-bold text-dark">My Profile</h4>
                        <p className="font-weight-normal mb-2 text-muted">Manage your personal information</p>
                    </div>
                    <div className="col-sm-4 text-right">
                        <button
                            className="btn btn-sm"
                            style={{ background: editMode ? "var(--text-dark)" : "var(--primary-pink)", color: "white", borderRadius: "20px", padding: "10px 20px", fontWeight: "600" }}
                            onClick={() => setEditMode(!editMode)}
                        >
                            {editMode ? "Cancel Editing" : "Edit Profile"}
                        </button>
                    </div>
                </div>

                <div className="row glass-card" style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="col-md-4 text-center mb-4 border-right pb-4">
                        <img src={`http://localhost:5001/${user.image}`} style={{ width: "230px", height: "230px", objectFit: "cover", borderRadius: "50%", boxShadow: "0 10px 20px rgba(0,0,0,0.1)", border: "4px solid var(--primary-pink)" }} alt="User" />
                        <div className="mt-4">
                            <input className='form-control form-control-sm mb-2' type="file" accept="image/*" onChange={handleImageChange} style={{ background: "rgba(255,255,255,0.8)", border: "1px solid var(--glass-border)", borderRadius: "10px", padding: "5px" }} />
                            <button className='btn btn-sm' style={{ background: 'var(--deep-pink)', color: 'white', borderRadius: '20px', padding: '8px 20px', border: 'none', width: "100%" }} onClick={handleImageUpload}>
                                {selectedImage ? 'Upload New Image' : 'Update Image'}
                            </button>
                        </div>
                        <h3 className="mt-4" style={{ color: "var(--deep-pink)", fontFamily: "'Playfair Display', serif" }}><strong>{user.name}</strong></h3>
                        <p className="text-muted">{user.email}</p>
                    </div>

                    <div className="col-md-8 px-md-5">
                        <h4 style={{ color: "var(--primary-pink)", borderBottom: "1px solid rgba(251, 111, 146, 0.3)", paddingBottom: "10px", marginBottom: "20px" }}>Personal Details</h4>

                        {!editMode ? (
                            <div className="row">
                                <div className="col-md-6 mb-3"><p><strong>Age: </strong> {user.age} Years</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Gender: </strong> {user.gender}</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Phone: </strong> {user.phone}</p></div>
                                <div className="col-md-6 mb-3"><p><strong>DOB: </strong> {user.dob}</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Caste: </strong> {user.caste}</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Location: </strong> {user.district}, {user.state}</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Height: </strong> {user.height} cm</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Weight: </strong> {user.weight} kg</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Education: </strong> {user.education}</p></div>
                                <div className="col-md-6 mb-3"><p><strong>Working Sector: </strong> {user.working}</p></div>
                                <div className="col-md-12 mb-3"><p><strong>About Me: </strong><br />{user.description}</p></div>
                            </div>
                        ) : (
                            <div className="row signup-container" style={{ padding: 0, margin: 0, background: "transparent", boxShadow: "none" }}>
                                <div className="user-details" style={{ margin: 0 }}>
                                    <div className="input-box"><span className="details">Name</span><input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">Age</span><input type="text" name="age" value={formData.age || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">Phone</span><input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">DOB</span><input type="date" name="dob" value={formData.dob || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">Caste</span><input type="text" name="caste" value={formData.caste || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">State</span><input type="text" name="state" value={formData.state || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">District</span><input type="text" name="district" value={formData.district || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">Height (cm)</span><input type="number" name="height" value={formData.height || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box"><span className="details">Weight (kg)</span><input type="text" name="weight" value={formData.weight || ''} onChange={handleInputChange} /></div>
                                    <div className="input-box">
                                        <span className="details">Education</span>
                                        <select name="education" value={formData.education || ''} onChange={handleInputChange} className="custom-select">
                                            <option value="bca">BCA</option><option value="mca">MCA</option><option value="bsc">Bachelor's of Science</option><option value="msc">MSC</option><option value="bcom">Bcom</option><option value="mcom">Mcom</option><option value="bed">B.ed</option><option value="med">M.ed</option><option value="10th">10th pass</option><option value="12th">12th pass</option><option value="mbbs">MBBS</option><option value="nursing">Nursing</option><option value="iit">IIT</option>
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Working</span>
                                        <select name="working" value={formData.working || ''} onChange={handleInputChange} className="custom-select">
                                            <option value="private sector">Private Sector</option><option value="government sector">Government Sector</option><option value="businessman">Businessman</option><option value="it industry">IT industry</option><option value="hardware">Hardware</option><option value="software">Software</option>
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Gender</span>
                                        <select name="gender" value={formData.gender || ''} onChange={handleInputChange} className="custom-select">
                                            <option value="Male">Male</option><option value="Female">Female</option><option value="Not known">Prefer not to say</option>
                                        </select>
                                    </div>
                                    <div className="input-box" style={{ width: "100%" }}>
                                        <span className="details">About Me</span>
                                        <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows="4"></textarea>
                                    </div>

                                    <div className="col-12 text-right mt-3">
                                        <button className="btn btn-success" style={{ background: "var(--primary-pink)", border: "none", borderRadius: "20px", padding: "10px 30px", fontSize: "16px", fontWeight: "bold" }} onClick={handleUpdateProfile}>Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Myprofile;