import API from '../api';
import React, { useState, useEffect } from 'react';
import Navbar from './fcomponents/Navbar';
import axios from 'axios';
import logo from '../saanjh-logo.jpg';
import './Signup.css';

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
    const nm = e.target.name;
    const vl = e.target.value;
    setUdetails(prev => ({ ...prev, [nm]: vl }));
    if (errors[nm]) {
      setErrors(prev => ({ ...prev, [nm]: null }));
    }
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
      if (!udetails.age || udetails.age < 18 || udetails.age > 100) newErrors.age = 'Valid Age (18–100)';
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
      if (!udetails.description || udetails.description.trim().length < 30) newErrors.description = 'Min 30 characters';
      if (!udetails.partnerPreference) newErrors.partnerPreference = 'Required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (validateStep()) setStep(s => s + 1);
  };

  const prevStep = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
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

  // Predefine render blocks for absolutely static mounting
  const renderStepOne = () => (
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
        {errors.createdBy && <span className="sp-error">{errors.createdBy}</span>}
      </div>

      <div className="sp-grid-2">
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-name">Full Name</label>
          <input id="inp-name" name="name" type="text" value={udetails.name} onChange={handleChange} className="sp-input" placeholder="Your full name" autoComplete="off" />
          {errors.name && <span className="sp-error">{errors.name}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-email">Email Address</label>
          <input id="inp-email" name="email" type="email" value={udetails.email} onChange={handleChange} className="sp-input" placeholder="Email" autoComplete="off" readOnly={!!sessionStorage.getItem('verifiedEmail')} style={{ background: sessionStorage.getItem('verifiedEmail') ? 'rgba(255,255,255,0.5)' : '' }} />
          {errors.email && <span className="sp-error">{errors.email}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-phone">Phone Number</label>
          <input id="inp-phone" name="phone" type="number" value={udetails.phone} onChange={handleChange} className="sp-input" placeholder="10-digit mobile number" autoComplete="off" />
          {errors.phone && <span className="sp-error">{errors.phone}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-password">Password</label>
          <input id="inp-password" name="password" type="password" value={udetails.password} onChange={handleChange} className="sp-input" placeholder="Min 8 characters" autoComplete="off" />
          {errors.password && <span className="sp-error">{errors.password}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-cpassword">Confirm Password</label>
          <input id="inp-cpassword" name="cpassword" type="password" value={udetails.cpassword} onChange={handleChange} className="sp-input" placeholder="Re-enter password" autoComplete="off" />
          {errors.cpassword && <span className="sp-error">{errors.cpassword}</span>}
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
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
        {errors.gender && <span className="sp-error">{errors.gender}</span>}
      </div>
      <div className="sp-grid-2">
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-age">Age</label>
          <input id="inp-age" name="age" type="number" value={udetails.age} onChange={handleChange} className="sp-input" placeholder="Your age" autoComplete="off" />
          {errors.age && <span className="sp-error">{errors.age}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-dob">Date of Birth</label>
          <input id="inp-dob" name="dob" type="date" value={udetails.dob} onChange={handleChange} className="sp-input" autoComplete="off" />
          {errors.dob && <span className="sp-error">{errors.dob}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-height">Height (cm)</label>
          <input id="inp-height" name="height" type="number" value={udetails.height} onChange={handleChange} className="sp-input" placeholder="e.g. 170" autoComplete="off" />
          {errors.height && <span className="sp-error">{errors.height}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-weight">Weight (kg)</label>
          <input id="inp-weight" name="weight" type="number" value={udetails.weight} onChange={handleChange} className="sp-input" placeholder="e.g. 65" autoComplete="off" />
          {errors.weight && <span className="sp-error">{errors.weight}</span>}
        </div>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="sp-step-section">
      <h2 className="sp-step-title">Background &amp; Location</h2>
      <div className="sp-grid-2">
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-religion">Religion</label>
          <select id="inp-religion" name="religion" value={udetails.religion} onChange={handleChange} className="sp-input">
            <option value="">Select Religion</option>
            {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Parsi', 'No Religion'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          {errors.religion && <span className="sp-error">{errors.religion}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-caste">Caste</label>
          <input id="inp-caste" name="caste" type="text" value={udetails.caste} onChange={handleChange} className="sp-input" placeholder="Your caste" autoComplete="off" />
          {errors.caste && <span className="sp-error">{errors.caste}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-motherTongue">Mother Tongue</label>
          <select id="inp-motherTongue" name="motherTongue" value={udetails.motherTongue} onChange={handleChange} className="sp-input">
            <option value="">Select Tongue</option>
            {['Hindi', 'Punjabi', 'Marathi', 'Gujarati', 'Tamil', 'English'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.motherTongue && <span className="sp-error">{errors.motherTongue}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-maritalStatus">Marital Status</label>
          <select id="inp-maritalStatus" name="maritalStatus" value={udetails.maritalStatus} onChange={handleChange} className="sp-input">
            {['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.maritalStatus && <span className="sp-error">{errors.maritalStatus}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-state">State</label>
          <select id="inp-state" name="state" value={udetails.state} onChange={handleChange} className="sp-input">
            <option value="">Select State</option>
            {['Bihar', 'Delhi', 'Maharashtra', 'Punjab', 'Karnataka', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'West Bengal'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <span className="sp-error">{errors.state}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-district">District / City</label>
          <input id="inp-district" name="district" type="text" value={udetails.district} onChange={handleChange} className="sp-input" placeholder="Your city" autoComplete="off" />
          {errors.district && <span className="sp-error">{errors.district}</span>}
        </div>
      </div>
    </div>
  );

  const renderStepFour = () => (
    <div className="sp-step-section">
      <h2 className="sp-step-title">Education &amp; Lifestyle</h2>
      <div className="sp-grid-2">
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-education">Highest Education</label>
          <select id="inp-education" name="education" value={udetails.education} onChange={handleChange} className="sp-input">
            <option value="">Select</option>
            {['BTech/BE', 'MBA', 'MTech', 'BCA', 'MCA', 'MBBS', 'BCom', 'BA', 'High School', 'Other'].map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          {errors.education && <span className="sp-error">{errors.education}</span>}
        </div>
        <div className="sp-field">
          <label className="sp-label" htmlFor="inp-working">Working Sector</label>
          <select id="inp-working" name="working" value={udetails.working} onChange={handleChange} className="sp-input">
            <option value="">Select</option>
            {['Private Sector', 'Govt Sector', 'Business/Self Employed', 'Defense', 'Not Working'].map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          {errors.working && <span className="sp-error">{errors.working}</span>}
        </div>
      </div>
      <div className="sp-field">
        <label className="sp-label" htmlFor="inp-description">About Me</label>
        <textarea id="inp-description" name="description" value={udetails.description} onChange={handleChange} placeholder="Share a bit about yourself... (min 30 characters)" className="sp-input sp-textarea" rows={4} autoComplete="off" />
        <small className="sp-note">⚠️ Do not share mobile numbers or social links — they will be removed.</small>
        {errors.description && <span className="sp-error">{errors.description}</span>}
      </div>
      <div className="sp-field">
        <label className="sp-label" htmlFor="inp-partnerPreference">Partner Preferences</label>
        <textarea id="inp-partnerPreference" name="partnerPreference" value={udetails.partnerPreference} onChange={handleChange} placeholder="What are you looking for in a partner?" className="sp-input sp-textarea" rows={4} autoComplete="off" />
        {errors.partnerPreference && <span className="sp-error">{errors.partnerPreference}</span>}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="sp-page" style={{ background: `url('${BG}') center/cover no-repeat fixed` }}>
        <div className="sp-overlay" />
        
        <div className="sp-content">
          <div className="sp-hero">
            <img src={logo} alt="Saanjh" className="sp-logo" />
            <h1 className="sp-title">Join Saanjh Matrimony</h1>
            <p className="sp-subtitle">Find your perfect match — step by step</p>
          </div>

          <div className="sp-progress-wrap">
            <div className={`sp-step-dot ${step >= 1 ? 'active' : ''} ${step === 1 ? 'current' : ''}`}>
              <div className="sp-step-num">1</div>
              <div className="sp-step-label">ACCOUNT</div>
            </div>
            <div className={`sp-connector ${step >= 2 ? 'done' : ''}`} />
            
            <div className={`sp-step-dot ${step >= 2 ? 'active' : ''} ${step === 2 ? 'current' : ''}`}>
              <div className="sp-step-num">2</div>
              <div className="sp-step-label">PERSONAL</div>
            </div>
            <div className={`sp-connector ${step >= 3 ? 'done' : ''}`} />

            <div className={`sp-step-dot ${step >= 3 ? 'active' : ''} ${step === 3 ? 'current' : ''}`}>
              <div className="sp-step-num">3</div>
              <div className="sp-step-label">BACKGROUND</div>
            </div>
            <div className={`sp-connector ${step >= 4 ? 'done' : ''}`} />

            <div className={`sp-step-dot ${step >= 4 ? 'active' : ''} ${step === 4 ? 'current' : ''}`}>
              <div className="sp-step-num">4</div>
              <div className="sp-step-label">LIFESTYLE</div>
            </div>
          </div>

          {serverMsg && (
            <div className="sp-server-error">⚠️ {serverMsg}</div>
          )}

          <form onSubmit={step === 4 ? handleSubmit : nextStep} className="sp-form">
            {step === 1 && renderStepOne()}
            {step === 2 && renderStepTwo()}
            {step === 3 && renderStepThree()}
            {step === 4 && renderStepFour()}

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