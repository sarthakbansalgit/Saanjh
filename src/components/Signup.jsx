import API from '../api';
import React, { useState, useEffect } from 'react';
import Navbar from './fcomponents/Navbar';
import Footer from './fcomponents/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import logo from '../saanjh-logo.jpg';

const Signup = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [serverMsg, setServerMsg] = useState("");

    const [udetails, setUdetails] = useState({
        name: "", age: "", email: "", phone: "", caste: "", dob: "",
        state: "", district: "", height: "", weight: "", education: "",
        working: "", password: "", description: "", gender: "",
        cpassword: "", religion: "", motherTongue: "", maritalStatus: "Never Married", partnerPreference: "", createdBy: "Self"
    });

    useEffect(() => {
        const verifiedEmail = sessionStorage.getItem("verifiedEmail");
        if (verifiedEmail) {
            setUdetails(prev => ({ ...prev, email: verifiedEmail }));
        }
    }, []);

    const handleChange = (e) => {
        setUdetails({
            ...udetails,
            [e.target.name]: e.target.value
        });

        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const validateStep = () => {
        const newErrors = {};
        let isValid = true;

        if (step === 1) {
            if (!udetails.createdBy) newErrors.createdBy = "Required";
            if (!udetails.name.trim()) newErrors.name = "Required";
            if (!udetails.email.trim()) newErrors.email = "Required";
            if (!udetails.phone.trim() || udetails.phone.length !== 10) newErrors.phone = "Valid 10-digit number required";
            if (!udetails.password.trim() || udetails.password.length < 8) newErrors.password = "Min 8 characters";
            if (udetails.password !== udetails.cpassword) newErrors.cpassword = "Passwords do not match";
        }
        else if (step === 2) {
            if (!udetails.gender) newErrors.gender = "Required";
            if (!udetails.age || udetails.age < 18 || udetails.age > 100) newErrors.age = "Valid Age (18-100) required";
            if (!udetails.dob) newErrors.dob = "Required";
            if (!udetails.height) newErrors.height = "Required";
            if (!udetails.weight) newErrors.weight = "Required";
        }
        else if (step === 3) {
            if (!udetails.religion) newErrors.religion = "Required";
            if (!udetails.motherTongue) newErrors.motherTongue = "Required";
            if (!udetails.caste) newErrors.caste = "Required";
            if (!udetails.maritalStatus) newErrors.maritalStatus = "Required";
            if (!udetails.state) newErrors.state = "Required";
            if (!udetails.district) newErrors.district = "Required";
        }
        if (step === 4) {
            if (!udetails.education) newErrors.education = "Required";
            if (!udetails.working) newErrors.working = "Required";
            if (!udetails.description || udetails.description.trim().length < 30) newErrors.description = "Min 30 characters required";
            if (!udetails.partnerPreference) newErrors.partnerPreference = "Required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        }
        return isValid;
    };

    const nextStep = (e) => {
        e.preventDefault();
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = (e) => {
        e.preventDefault();
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMsg("");

        if (validateStep()) {
            try {
                // Ensure payload matches backend exact names
                const payload = {
                    ...udetails,
                    // Map createdBy if necessary, backend absorbs everything via req.body
                }

                const { data } = await axios.post(`${API}/auth/page1/createuser`, payload, {
                    headers: { 'Content-Type': 'application/json' }
                });

                if (data.success) {
                    localStorage.setItem('token', data.authToken);
                    window.alert("Successfully Registered! You are now logged in and redirected to the dashboard.");
                    window.location.hash = "#/";
                    window.location.reload();
                }
                else {
                    setServerMsg(data.error || "Validation error");
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.errors) {
                    const mappedErrs = error.response.data.errors.map(err => err.msg).join(", ");
                    setServerMsg(mappedErrs);
                } else if (error.response && error.response.data && error.response.data.error) {
                    setServerMsg(error.response.data.error);
                } else {
                    setServerMsg("Server verification failed. Please check connection.");
                }
            }
        }
    };

    const ErrorSpan = ({ name }) => errors[name] ? <span className="error-red text-danger" style={{ fontSize: "12px", display: "block", marginTop: "-15px", marginBottom: "10px" }}>{errors[name]}</span> : null;

    return (
        <>
            <Navbar />

            <div className="signup-container py-5" style={{ minHeight: "100vh", background: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat fixed" }}>

                {/* Stepper Wizard Box */}
                <div className="container p-0" style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "30px", overflow: "hidden", background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>

                    {/* Header/Progress bar */}
                    <div className="stepper-header text-center py-4" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white" }}>
                        <img src={logo} alt="Saanjh" style={{ height: "70px", objectFit: "contain", marginBottom: "8px", filter: "brightness(1.05)" }} />
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold" }}>Join Saanjh Matrimony</h2>
                        <p className="mb-0">Find your perfect match</p>

                        <div className="d-flex justify-content-center align-items-center mt-3" style={{ gap: "20px" }}>
                            {[1, 2, 3, 4].map(num => (
                                <div key={num} style={{ display: "flex", alignItems: "center" }}>
                                    <div style={{
                                        width: "35px", height: "35px", borderRadius: "50%",
                                        background: step >= num ? "white" : "rgba(255,255,255,0.3)",
                                        color: step >= num ? "var(--deep-pink)" : "white",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontWeight: "bold", border: "2px solid white",
                                        transition: "all 0.3s ease",
                                        fontSize: "16px"
                                    }}>
                                        {num}
                                    </div>
                                    {num < 4 && <div style={{ height: "4px", width: "30px", background: step > num ? "white" : "rgba(255,255,255,0.3)", marginLeft: "10px" }}></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="content p-5">
                        {serverMsg && step !== 5 && (
                            <div className="alert alert-danger text-center" style={{ borderRadius: "15px", fontSize: "14px", fontWeight: "bold" }}>
                                ⚠️ {serverMsg}
                            </div>
                        )}

                        <form onSubmit={(e) => e.preventDefault()}>

                            {/* STEP 1: Account Setup */}
                            {step === 1 && (
                                <div className="step-animation">
                                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2" style={{ borderBottomColor: "rgba(251,111,146,0.3)" }}>
                                        <h4 style={{ color: "var(--deep-pink)", margin: 0 }}>Basic Account Setup</h4>
                                    </div>

                                    <div className="user-details user-details-grid">
                                        <div className="input-box" style={{ width: "100%", gridColumn: "span 2" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Profile Creating For</span>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                                                {['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'].map(option => (
                                                    <label key={option} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                                                        <input type="radio" name="createdBy" value={option} checked={udetails.createdBy === option} onChange={handleChange} /> {option}
                                                    </label>
                                                ))}
                                            </div>
                                            <ErrorSpan name="createdBy" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Full Name</span>
                                            <input type="text" name="name" value={udetails.name} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                            <ErrorSpan name="name" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Email</span>
                                            <input type="email" name="email" value={udetails.email} readOnly={!!sessionStorage.getItem("verifiedEmail")} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px", background: sessionStorage.getItem("verifiedEmail") ? "#e9ecef" : "white" }} />
                                            <ErrorSpan name="email" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Phone Number</span>
                                            <input type="number" name="phone" value={udetails.phone} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px", background: "white" }} />
                                            <ErrorSpan name="phone" />
                                        </div>

                                        <div className="user-details-grid" style={{ gridColumn: "span 2" }}>
                                            <div className="input-box" style={{ width: "100%" }}>
                                                <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Password</span>
                                                <input type="password" name="password" value={udetails.password} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                                <ErrorSpan name="password" />
                                            </div>

                                            <div className="input-box" style={{ width: "100%" }}>
                                                <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Confirm Password</span>
                                                <input type="password" name="cpassword" value={udetails.cpassword} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                                <ErrorSpan name="cpassword" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Personal Details */}
                            {step === 2 && (
                                <div className="step-animation">
                                    <h4 style={{ color: "var(--deep-pink)", marginBottom: "25px", borderBottom: "2px solid rgba(251,111,146,0.3)", paddingBottom: "10px" }}>Personal Details</h4>

                                    <div className="user-details user-details-grid">
                                        <div className="input-box" style={{ width: "100%", gridColumn: "span 2" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Gender</span>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
                                                {['Male', 'Female'].map(option => (
                                                    <label key={option} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "10px 20px", border: "1px solid var(--primary-pink)", borderRadius: "10px", background: udetails.gender === option ? "var(--primary-pink)" : "white", color: udetails.gender === option ? "white" : "var(--text-dark)" }}>
                                                        <input type="radio" name="gender" value={option} checked={udetails.gender === option} onChange={handleChange} style={{ display: "none" }} /> {option}
                                                    </label>
                                                ))}
                                            </div>
                                            <ErrorSpan name="gender" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Age</span>
                                            <input type="number" name="age" value={udetails.age} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                            <ErrorSpan name="age" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Date of Birth</span>
                                            <input type="date" name="dob" value={udetails.dob} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                            <ErrorSpan name="dob" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Height (in cm)</span>
                                            <input type="number" name="height" placeholder="e.g. 170" value={udetails.height} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                            <ErrorSpan name="height" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Weight (in kg)</span>
                                            <input type="number" name="weight" value={udetails.weight} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                            <ErrorSpan name="weight" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Background & Location */}
                            {step === 3 && (
                                <div className="step-animation">
                                    <h4 style={{ color: "var(--deep-pink)", marginBottom: "25px", borderBottom: "2px solid rgba(251,111,146,0.3)", paddingBottom: "10px" }}>Background & Location</h4>

                                    <div className="user-details user-details-grid">
                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Religion</span>
                                            <select name="religion" value={udetails.religion} onChange={handleChange} className="form-control custom-select" style={{ color: "#333", borderRadius: "10px", padding: "12px" }}>
                                                <option value="">Select Religion</option>
                                                <option value="Hindu">Hindu</option><option value="Muslim">Muslim</option><option value="Sikh">Sikh</option>
                                                <option value="Christian">Christian</option><option value="Jain">Jain</option><option value="Parsi">Parsi</option>
                                                <option value="No Religion">No Religion</option>
                                            </select>
                                            <ErrorSpan name="religion" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Caste</span>
                                            <input type="text" name="caste" value={udetails.caste} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                            <ErrorSpan name="caste" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Mother Tongue</span>
                                            <select name="motherTongue" value={udetails.motherTongue} onChange={handleChange} className="form-control custom-select" style={{ color: "#333", borderRadius: "10px", padding: "12px" }}>
                                                <option value="">Select Tongue</option>
                                                <option value="Hindi">Hindi</option><option value="Punjabi">Punjabi</option><option value="Marathi">Marathi</option>
                                                <option value="Gujarati">Gujarati</option><option value="Tamil">Tamil</option><option value="English">English</option>
                                            </select>
                                            <ErrorSpan name="motherTongue" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Marital Status</span>
                                            <select name="maritalStatus" value={udetails.maritalStatus} onChange={handleChange} className="form-control custom-select" style={{ color: "#333", borderRadius: "10px", padding: "12px" }}>
                                                <option value="Never Married">Never Married</option><option value="Awaiting Divorce">Awaiting Divorce</option>
                                                <option value="Divorced">Divorced</option><option value="Widowed">Widowed</option>
                                            </select>
                                            <ErrorSpan name="maritalStatus" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>State</span>
                                            <select name="state" value={udetails.state} onChange={handleChange} className="form-control custom-select" style={{ color: "#333", borderRadius: "10px", padding: "12px" }}>
                                                <option value="">Select State</option>
                                                <option value="Bihar">Bihar</option><option value="Delhi">Delhi</option><option value="Maharashtra">Maharashtra</option>
                                                <option value="Punjab">Punjab</option><option value="Karnataka">Karnataka</option><option value="Gujarat">Gujarat</option>
                                            </select>
                                            <ErrorSpan name="state" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>District/City</span>
                                            <input type="text" name="district" value={udetails.district} onChange={handleChange} className="form-control" style={{ color: "#333", borderRadius: "10px", padding: "12px" }} />
                                            <ErrorSpan name="district" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 4: Education & Profession & About You */}
                            {step === 4 && (
                                <div className="step-animation">
                                    <h4 style={{ color: "var(--deep-pink)", marginBottom: "25px", borderBottom: "2px solid rgba(251,111,146,0.3)", paddingBottom: "10px" }}>Education & Lifestyle</h4>

                                    <div className="user-details user-details-grid">
                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Highest Education</span>
                                            <select name="education" value={udetails.education} onChange={handleChange} className="form-control custom-select" style={{ color: "#333", borderRadius: "10px", padding: "12px" }}>
                                                <option value="">Select</option>
                                                <option value="BTech/BE">BTech/BE</option><option value="MBA">MBA</option><option value="MTech">MTech</option>
                                                <option value="BCA">BCA</option><option value="MCA">MCA</option><option value="MBBS">MBBS</option>
                                                <option value="BCom">BCom</option><option value="High School">High School</option>
                                            </select>
                                            <ErrorSpan name="education" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Working Sector</span>
                                            <select name="working" value={udetails.working} onChange={handleChange} className="form-control custom-select" style={{ color: "#333", borderRadius: "10px", padding: "12px" }}>
                                                <option value="">Select</option>
                                                <option value="Private Sector">Private Sector</option><option value="Govt Sector">Govt Sector</option>
                                                <option value="Business/Self Employed">Business/Self Employed</option><option value="Defese">Defense</option><option value="Not Working">Not Working</option>
                                            </select>
                                            <ErrorSpan name="working" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%", gridColumn: "span 2" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>About Me</span>
                                            <textarea name="description" value={udetails.description} onChange={handleChange} placeholder="Share a few details about yourself..." className="form-control" rows="3" style={{ color: "#333", borderRadius: "10px", padding: "12px", resize: "none" }}></textarea>
                                            <p style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>⚠️ Note: Sharing Mobile numbers or Social Links is not allowed and will be removed.</p>
                                            <ErrorSpan name="description" />
                                        </div>

                                        <div className="input-box" style={{ width: "100%", gridColumn: "span 2" }}>
                                            <span className="details" style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "5px", display: "block" }}>Partner Preferences</span>
                                            <textarea name="partnerPreference" value={udetails.partnerPreference} onChange={handleChange} placeholder="What are you looking for in a partner?" className="form-control" rows="3" style={{ color: "#333", borderRadius: "10px", padding: "12px", resize: "none" }}></textarea>
                                            <ErrorSpan name="partnerPreference" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="mt-4 pt-4 border-top d-flex justify-content-between">
                                {step > 1 ? (
                                    <button onClick={prevStep} className="btn btn-outline-secondary" style={{ borderRadius: "50px", padding: "12px 30px", fontWeight: "bold" }}>Back</button>
                                ) : <div></div>}

                                {step < 4 && (
                                    <button onClick={nextStep} className="btn" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "white", borderRadius: "50px", padding: "12px 35px", fontWeight: "bold", border: "none", boxShadow: "0 10px 20px rgba(251, 111, 146, 0.4)" }}>Continue</button>
                                )}
                                {step === 4 && (
                                    <button onClick={handleSubmit} className="btn" style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", borderRadius: "50px", padding: "12px 40px", fontWeight: "bold", border: "none", boxShadow: "0 10px 20px rgba(16, 185, 129, 0.3)" }}>Complete Registration</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div >
            </div >

            <Footer />
        </>
    );
};

export default Signup;