import API from '../api';
import React, { useState, useEffect } from 'react';
import Navbar from './fcomponents/Navbar';
import axios from 'axios';
import logo from '../saanjh-logo.jpg';

const STEPS = [
  { num: 1, label: 'Account' },
  { num: 2, label: 'Personal' },
  { num: 3, label: 'Background' },
  { num: 4, label: 'Lifestyle' },
];

const BG = process.env.PUBLIC_URL + "/bg.jpeg";








const Signup = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const [udetails, setUdetails] = useState({
    name: '', age: '', email: '', phone: '', caste: '', dob: '',
    state: '', district: '', height: '', weight: '', education: '',
    working: '', password: '', description: '', gender: '',
    cpassword: '', religion: '', motherTongue: '', maritalStatus: 'Never Married',
    partnerPreference: '', createdBy: 'Self'
  });

  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem('verifiedEmail');
    if (verifiedEmail) setUdetails(prev => ({ ...prev, email: verifiedEmail }));
  }, []);

  const handleChange = (e) => {
    setUdetails({ ...udetails, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!udetails.createdBy) newErrors.createdBy = 'Required';
      if (!udetails.name.trim()) newErrors.name = 'Required';
      if (!udetails.email.trim()) newErrors.email = 'Required';
      if (!udetails.phone.trim() || udetails.phone.length !== 10) newErrors.phone = 'Valid 10-digit number required';
      if (!udetails.password.trim() || udetails.password.length < 8) newErrors.password = 'Min 8 characters';
      if (udetails.password !== udetails.cpassword) newErrors.cpassword = 'Passwords do not match';
    } else if (step === 2) {
      if (!udetails.gender) newErrors.gender = 'Required';
      if (!udetails.age || udetails.age < 18 || udetails.age > 100) newErrors.age = 'Valid Age (18–100) required';
      if (!udetails.dob) newErrors.dob = 'Required';
      if (!udetails.height) newErrors.height = 'Required';
      if (!udetails.weight) newErrors.weight = 'Required';
    } else if (step === 3) {
      if (!udetails.religion) newErrors.religion = 'Required';
      if (!udetails.motherTongue) newErrors.motherTongue = 'Required';
      if (!udetails.caste) newErrors.caste = 'Required';
      if (!udetails.maritalStatus) newErrors.maritalStatus = 'Required';
      if (!udetails.state) newErrors.state = 'Required';
      if (!udetails.district) newErrors.district = 'Required';
    } else if (step === 4) {
      if (!udetails.education) newErrors.education = 'Required';
      if (!udetails.working) newErrors.working = 'Required';
      if (!udetails.description || udetails.description.trim().length < 30) newErrors.description = 'Min 30 characters required';
      if (!udetails.partnerPreference) newErrors.partnerPreference = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => { e.preventDefault(); if (validateStep()) setStep(s => s + 1); };
  const prevStep = (e) => { e.preventDefault(); setStep(s => s - 1); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg('');
    if (!validateStep()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/page1/createuser`, udetails, {
        headers: { 'Content-Type': 'application/json' }
      });
      if (data.success) {
        localStorage.setItem('token', data.authToken);
        window.alert('Successfully Registered! You are now logged in.');
        window.location.replace(window.location.pathname + '#/');
        window.location.reload();
      } else {
        setServerMsg(data.error || 'Validation error');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setServerMsg(err.response.data.errors.map(e => e.msg).join(', '));
      } else if (err.response?.data?.error) {
        setServerMsg(err.response.data.error);
      } else {
        setServerMsg('Server error. Please check your connection.');
      }
    }
    setLoading(false);
  };

  

  
  
  
  return (
    <>
      <Navbar />

      {/* ── Full-screen page ── */}
      <div className="sp-page" style={{ background: `url('${BG}') center/cover no-repeat fixed` }}>

        {/* Overlay */}
        <div className="sp-overlay" />

        {/* Content area */}
        <div className="sp-content">

          {/* Logo + title */}
          <div className="sp-hero">
            <img src={logo} alt="Saanjh" className="sp-logo" />
            <h1 className="sp-title">Join Saanjh Matrimony</h1>
            <p className="sp-subtitle">Find your perfect match — step by step</p>
          </div>

          {/* Progress bar */}
          <div className="sp-progress-wrap">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className={`sp-step-dot ${step >= s.num ? 'active' : ''} ${step === s.num ? 'current' : ''}`}>
                  <span className="sp-step-num">{s.num}</span>
                  <span className="sp-step-label">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`sp-connector ${step > s.num ? 'done' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Error banner */}
          {serverMsg && (
            <div className="sp-server-error">⚠️ {serverMsg}</div>
          )}

          {/* Form */}
          <form onSubmit={step === 4 ? handleSubmit : nextStep} className="sp-form">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Basic Account Setup</h2>

                <div className="sp-field">
                    <label className="sp-label">Profile Creating For</label>
                    <div className="sp-radio-group">
                    {['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'].map(opt => (
                      <label key={opt} className={`sp-radio-pill ${udetails.createdBy === opt ? 'selected' : ''}`}>
                        <input type="radio" name="createdBy" value={opt} checked={udetails.createdBy === opt} onChange={handleChange} hidden />
                        {opt}
                      </label>
                    ))}
                  </div>
                    {errors && errors['createdBy'] && <span className="sp-error">{errors['createdBy']}</span>}
                  </div>

                <div className="sp-grid-2">
                  <div className="sp-field">
                    <label className="sp-label">Full Name</label>
                    <input
                      name="name"
                      value={udetails['name']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" placeholder="Your full name" />
                    {errors && errors['name'] && <span className="sp-error">{errors['name']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Email Address</label>
                    <input
                      name="email"
                      value={udetails['email']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="email" placeholder="Email"
                      readOnly={!!sessionStorage.getItem('verifiedEmail')}
                      style={{ background: sessionStorage.getItem('verifiedEmail') ? 'rgba(255,255,255,0.5)' : '' }}
                    />
                    {errors && errors['email'] && <span className="sp-error">{errors['email']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Phone Number</label>
                    <input
                      name="phone"
                      value={udetails['phone']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="number" placeholder="10-digit mobile number" />
                    {errors && errors['phone'] && <span className="sp-error">{errors['phone']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Password</label>
                    <input
                      name="password"
                      value={udetails['password']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="password" placeholder="Min 8 characters" />
                    {errors && errors['password'] && <span className="sp-error">{errors['password']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Confirm Password</label>
                    <input
                      name="cpassword"
                      value={udetails['cpassword']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="password" placeholder="Re-enter password" />
                    {errors && errors['cpassword'] && <span className="sp-error">{errors['cpassword']}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Personal Details</h2>

                <div className="sp-field">
                    <label className="sp-label">Gender</label>
                    <div className="sp-radio-group">
                    {['Male', 'Female'].map(opt => (
                      <label key={opt} className={`sp-radio-pill ${udetails.gender === opt ? 'selected' : ''}`}>
                        <input type="radio" name="gender" value={opt} checked={udetails.gender === opt} onChange={handleChange} hidden />
                        {opt}
                      </label>
                    ))}
                  </div>
                    {errors && errors['gender'] && <span className="sp-error">{errors['gender']}</span>}
                  </div>

                <div className="sp-grid-2">
                  <div className="sp-field">
                    <label className="sp-label">Age</label>
                    <input
                      name="age"
                      value={udetails['age']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="number" placeholder="Your age" />
                    {errors && errors['age'] && <span className="sp-error">{errors['age']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Date of Birth</label>
                    <input
                      name="dob"
                      value={udetails['dob']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="date" />
                    {errors && errors['dob'] && <span className="sp-error">{errors['dob']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Height (cm)</label>
                    <input
                      name="height"
                      value={udetails['height']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="number" placeholder="e.g. 170" />
                    {errors && errors['height'] && <span className="sp-error">{errors['height']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Weight (kg)</label>
                    <input
                      name="weight"
                      value={udetails['weight']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" type="number" placeholder="e.g. 65" />
                    {errors && errors['weight'] && <span className="sp-error">{errors['weight']}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Background &amp; Location</h2>
                <div className="sp-grid-2">
                  <div className="sp-field">
                    <label className="sp-label">Religion</label>
                    <select
                      name="religion"
                      value={udetails['religion']}
                      onChange={handleChange}
                      className="sp-input">
                      <option value="">Select Religion</option>
                      {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Parsi', 'No Religion'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors && errors['religion'] && <span className="sp-error">{errors['religion']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Caste</label>
                    <input
                      name="caste"
                      value={udetails['caste']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" placeholder="Your caste" />
                    {errors && errors['caste'] && <span className="sp-error">{errors['caste']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Mother Tongue</label>
                    <select
                      name="motherTongue"
                      value={udetails['motherTongue']}
                      onChange={handleChange}
                      className="sp-input">
                      <option value="">Select Tongue</option>
                      {['Hindi', 'Punjabi', 'Marathi', 'Gujarati', 'Tamil', 'English'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors && errors['motherTongue'] && <span className="sp-error">{errors['motherTongue']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Marital Status</label>
                    <select
                      name="maritalStatus"
                      value={udetails['maritalStatus']}
                      onChange={handleChange}
                      className="sp-input">
                      {['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    {errors && errors['maritalStatus'] && <span className="sp-error">{errors['maritalStatus']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">State</label>
                    <select
                      name="state"
                      value={udetails['state']}
                      onChange={handleChange}
                      className="sp-input">
                      <option value="">Select State</option>
                      {['Bihar', 'Delhi', 'Maharashtra', 'Punjab', 'Karnataka', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'West Bengal'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors && errors['state'] && <span className="sp-error">{errors['state']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">District / City</label>
                    <input
                      name="district"
                      value={udetails['district']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off" placeholder="Your city or district" />
                    {errors && errors['district'] && <span className="sp-error">{errors['district']}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Education &amp; Lifestyle</h2>
                <div className="sp-grid-2">
                  <div className="sp-field">
                    <label className="sp-label">Highest Education</label>
                    <select
                      name="education"
                      value={udetails['education']}
                      onChange={handleChange}
                      className="sp-input">
                      <option value="">Select</option>
                      {['BTech/BE', 'MBA', 'MTech', 'BCA', 'MCA', 'MBBS', 'BCom', 'BA', 'High School', 'Other'].map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                    {errors && errors['education'] && <span className="sp-error">{errors['education']}</span>}
                  </div>
                  <div className="sp-field">
                    <label className="sp-label">Working Sector</label>
                    <select
                      name="working"
                      value={udetails['working']}
                      onChange={handleChange}
                      className="sp-input">
                      <option value="">Select</option>
                      {['Private Sector', 'Govt Sector', 'Business/Self Employed', 'Defense', 'Not Working'].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                    {errors && errors['working'] && <span className="sp-error">{errors['working']}</span>}
                  </div>
                </div>

                <div className="sp-field">
                    <label className="sp-label">About Me</label>
                    <textarea
                    name="description"
                    value={udetails.description}
                    onChange={handleChange}
                    placeholder="Share a bit about yourself... (min 30 characters)"
                    className="sp-input sp-textarea"
                    rows={4}
                  />
                  <small className="sp-note">⚠️ Do not share mobile numbers or social links — they will be removed.</small>
                    {errors && errors['description'] && <span className="sp-error">{errors['description']}</span>}
                  </div>

                <div className="sp-field">
                    <label className="sp-label">Partner Preferences</label>
                    <textarea
                    name="partnerPreference"
                    value={udetails.partnerPreference}
                    onChange={handleChange}
                    placeholder="What are you looking for in a partner?"
                    className="sp-input sp-textarea"
                    rows={4}
                  />
                    {errors && errors['partnerPreference'] && <span className="sp-error">{errors['partnerPreference']}</span>}
                  </div>
              </div>
            )}

            {/* ── Navigation Buttons ── */}
            <div className="sp-nav-buttons">
              {step > 1
                ? <button type="button" onClick={prevStep} className="sp-btn-back">← Back</button>
                : <span />
              }
              {step < 4
                ? <button type="submit" className="sp-btn-next">Continue →</button>
                : <button type="submit" className="sp-btn-submit" disabled={loading}>
                    {loading ? 'Registering...' : '✓ Complete Registration'}
                  </button>
              }
            </div>
          </form>
        </div>
      </div>

      
    </>
  );
};

export default Signup;