import API from '../api';
import React, { useState, useEffect } from 'react';
import Navbar from './fcomponents/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../saanjh-logo.jpg';

const STEPS = [
  { num: 1, label: 'Account' },
  { num: 2, label: 'Personal' },
  { num: 3, label: 'Background' },
  { num: 4, label: 'Lifestyle' },
];

const BG = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80";

const Signup = () => {
  const navigate = useNavigate();
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

  const Err = ({ name }) => errors[name]
    ? <span className="sp-error">{errors[name]}</span>
    : null;

  const Select = ({ name, children, ...rest }) => (
    <select name={name} value={udetails[name]} onChange={handleChange} className="sp-input" {...rest}>
      {children}
    </select>
  );

  const Input = ({ name, type = 'text', ...rest }) => (
    <input
      type={type}
      name={name}
      value={udetails[name]}
      onChange={handleChange}
      className="sp-input"
      autoComplete="off"
      {...rest}
    />
  );

  const Field = ({ name, label, children }) => (
    <div className="sp-field">
      <label className="sp-label">{label}</label>
      {children}
      <Err name={name} />
    </div>
  );

  return (
    <>
      <Navbar />

      {/* ── Full-screen page ── */}
      <div className="sp-page">

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
          <form onSubmit={e => e.preventDefault()} className="sp-form">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Basic Account Setup</h2>

                <Field name="createdBy" label="Profile Creating For">
                  <div className="sp-radio-group">
                    {['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'].map(opt => (
                      <label key={opt} className={`sp-radio-pill ${udetails.createdBy === opt ? 'selected' : ''}`}>
                        <input type="radio" name="createdBy" value={opt} checked={udetails.createdBy === opt} onChange={handleChange} hidden />
                        {opt}
                      </label>
                    ))}
                  </div>
                </Field>

                <div className="sp-grid-2">
                  <Field name="name" label="Full Name">
                    <Input name="name" placeholder="Your full name" />
                  </Field>
                  <Field name="email" label="Email Address">
                    <Input name="email" type="email" placeholder="Email"
                      readOnly={!!sessionStorage.getItem('verifiedEmail')}
                      style={{ background: sessionStorage.getItem('verifiedEmail') ? 'rgba(255,255,255,0.5)' : '' }}
                    />
                  </Field>
                  <Field name="phone" label="Phone Number">
                    <Input name="phone" type="number" placeholder="10-digit mobile number" />
                  </Field>
                  <Field name="password" label="Password">
                    <Input name="password" type="password" placeholder="Min 8 characters" />
                  </Field>
                  <Field name="cpassword" label="Confirm Password">
                    <Input name="cpassword" type="password" placeholder="Re-enter password" />
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Personal Details</h2>

                <Field name="gender" label="Gender">
                  <div className="sp-radio-group">
                    {['Male', 'Female'].map(opt => (
                      <label key={opt} className={`sp-radio-pill ${udetails.gender === opt ? 'selected' : ''}`}>
                        <input type="radio" name="gender" value={opt} checked={udetails.gender === opt} onChange={handleChange} hidden />
                        {opt}
                      </label>
                    ))}
                  </div>
                </Field>

                <div className="sp-grid-2">
                  <Field name="age" label="Age">
                    <Input name="age" type="number" placeholder="Your age" />
                  </Field>
                  <Field name="dob" label="Date of Birth">
                    <Input name="dob" type="date" />
                  </Field>
                  <Field name="height" label="Height (cm)">
                    <Input name="height" type="number" placeholder="e.g. 170" />
                  </Field>
                  <Field name="weight" label="Weight (kg)">
                    <Input name="weight" type="number" placeholder="e.g. 65" />
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Background &amp; Location</h2>
                <div className="sp-grid-2">
                  <Field name="religion" label="Religion">
                    <Select name="religion">
                      <option value="">Select Religion</option>
                      {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Parsi', 'No Religion'].map(r => <option key={r} value={r}>{r}</option>)}
                    </Select>
                  </Field>
                  <Field name="caste" label="Caste">
                    <Input name="caste" placeholder="Your caste" />
                  </Field>
                  <Field name="motherTongue" label="Mother Tongue">
                    <Select name="motherTongue">
                      <option value="">Select Tongue</option>
                      {['Hindi', 'Punjabi', 'Marathi', 'Gujarati', 'Tamil', 'English'].map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </Field>
                  <Field name="maritalStatus" label="Marital Status">
                    <Select name="maritalStatus">
                      {['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed'].map(m => <option key={m} value={m}>{m}</option>)}
                    </Select>
                  </Field>
                  <Field name="state" label="State">
                    <Select name="state">
                      <option value="">Select State</option>
                      {['Bihar', 'Delhi', 'Maharashtra', 'Punjab', 'Karnataka', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'West Bengal'].map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                  </Field>
                  <Field name="district" label="District / City">
                    <Input name="district" placeholder="Your city or district" />
                  </Field>
                </div>
              </div>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <div className="sp-step-section">
                <h2 className="sp-step-title">Education &amp; Lifestyle</h2>
                <div className="sp-grid-2">
                  <Field name="education" label="Highest Education">
                    <Select name="education">
                      <option value="">Select</option>
                      {['BTech/BE', 'MBA', 'MTech', 'BCA', 'MCA', 'MBBS', 'BCom', 'BA', 'High School', 'Other'].map(e => <option key={e} value={e}>{e}</option>)}
                    </Select>
                  </Field>
                  <Field name="working" label="Working Sector">
                    <Select name="working">
                      <option value="">Select</option>
                      {['Private Sector', 'Govt Sector', 'Business/Self Employed', 'Defense', 'Not Working'].map(w => <option key={w} value={w}>{w}</option>)}
                    </Select>
                  </Field>
                </div>

                <Field name="description" label="About Me">
                  <textarea
                    name="description"
                    value={udetails.description}
                    onChange={handleChange}
                    placeholder="Share a bit about yourself... (min 30 characters)"
                    className="sp-input sp-textarea"
                    rows={4}
                  />
                  <small className="sp-note">⚠️ Do not share mobile numbers or social links — they will be removed.</small>
                  <Err name="description" />
                </Field>

                <Field name="partnerPreference" label="Partner Preferences">
                  <textarea
                    name="partnerPreference"
                    value={udetails.partnerPreference}
                    onChange={handleChange}
                    placeholder="What are you looking for in a partner?"
                    className="sp-input sp-textarea"
                    rows={4}
                  />
                </Field>
              </div>
            )}

            {/* ── Navigation Buttons ── */}
            <div className="sp-nav-buttons">
              {step > 1
                ? <button type="button" onClick={prevStep} className="sp-btn-back">← Back</button>
                : <span />
              }
              {step < 4
                ? <button type="button" onClick={nextStep} className="sp-btn-next">Continue →</button>
                : <button type="button" onClick={handleSubmit} className="sp-btn-submit" disabled={loading}>
                    {loading ? 'Registering...' : '✓ Complete Registration'}
                  </button>
              }
            </div>
          </form>
        </div>
      </div>

      {/* Inline styles: scoped to signup page, no external CSS needed */}
      <style>{`
        .sp-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: url('${BG}') center/cover no-repeat fixed;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 80px; /* navbar height */
          padding-bottom: 40px;
          box-sizing: border-box;
        }

        .sp-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(135deg, rgba(80,0,40,0.72) 0%, rgba(180,60,100,0.55) 60%, rgba(0,0,0,0.65) 100%);
          pointer-events: none;
          z-index: 0;
        }

        .sp-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 860px;
          padding: 0 20px;
          box-sizing: border-box;
        }

        /* ── Hero header ── */
        .sp-hero {
          text-align: center;
          padding: 30px 0 20px;
        }
        .sp-logo {
          height: 70px;
          object-fit: contain;
          border-radius: 12px;
          margin-bottom: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .sp-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(22px, 5vw, 38px);
          color: #fff;
          margin: 0 0 6px;
          font-weight: 700;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
        }
        .sp-subtitle {
          color: rgba(255,255,255,0.8);
          font-size: clamp(13px, 2.5vw, 16px);
          margin: 0;
        }

        /* ── Progress steps ── */
        .sp-progress-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin: 24px 0 28px;
          flex-wrap: nowrap;
        }
        .sp-step-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .sp-step-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.4);
          color: rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.35s ease;
        }
        .sp-step-dot.active .sp-step-num {
          background: #fff;
          border-color: #fff;
          color: #c2185b;
        }
        .sp-step-dot.current .sp-step-num {
          box-shadow: 0 0 0 4px rgba(255,255,255,0.35);
          transform: scale(1.12);
        }
        .sp-step-label {
          color: rgba(255,255,255,0.7);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .sp-step-dot.active .sp-step-label { color: #fff; }
        .sp-connector {
          flex: 1;
          height: 3px;
          background: rgba(255,255,255,0.2);
          margin: 0 6px;
          margin-bottom: 18px;
          border-radius: 2px;
          min-width: 20px;
          max-width: 80px;
          transition: background 0.35s;
        }
        .sp-connector.done { background: rgba(255,255,255,0.85); }

        /* ── Server error ── */
        .sp-server-error {
          background: rgba(220, 53, 69, 0.85);
          color: #fff;
          border-radius: 12px;
          padding: 12px 18px;
          font-size: 14px;
          margin-bottom: 20px;
          font-weight: 600;
          backdrop-filter: blur(6px);
        }

        /* ── Form ── */
        .sp-form {
          width: 100%;
        }
        .sp-step-section {
          animation: spFadeUp 0.4s ease both;
        }
        @keyframes spFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sp-step-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(18px, 4vw, 26px);
          color: #fff;
          margin: 0 0 22px;
          font-weight: 700;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(255,255,255,0.2);
        }

        /* ── Grid ── */
        .sp-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
        @media (max-width: 600px) {
          .sp-grid-2 { grid-template-columns: 1fr; }
        }

        /* ── Fields ── */
        .sp-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 18px;
        }
        .sp-label {
          color: rgba(255,255,255,0.9);
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 7px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }
        .sp-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.13);
          color: #fff;
          font-size: 15px;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }
        .sp-input::placeholder { color: rgba(255,255,255,0.45); }
        .sp-input:focus {
          border-color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.22);
        }
        .sp-input option { color: #222; background: #fff; }
        .sp-textarea { resize: vertical; min-height: 100px; }
        .sp-note {
          color: rgba(255,220,220,0.85);
          font-size: 12px;
          margin-top: 5px;
        }
        .sp-error {
          color: #ff8ab4;
          font-size: 12px;
          margin-top: 4px;
          font-weight: 600;
        }

        /* ── Radio pills ── */
        .sp-radio-group {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 4px;
        }
        .sp-radio-pill {
          padding: 8px 18px;
          border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.35);
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
          font-weight: 500;
        }
        .sp-radio-pill.selected {
          background: #fff;
          color: #c2185b;
          border-color: #fff;
          font-weight: 700;
        }

        /* ── Buttons ── */
        .sp-nav-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 28px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.15);
          gap: 12px;
        }
        .sp-btn-back {
          background: rgba(255,255,255,0.12);
          border: 1.5px solid rgba(255,255,255,0.35);
          color: #fff;
          padding: 12px 28px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .sp-btn-back:hover { background: rgba(255,255,255,0.25); }
        .sp-btn-next {
          background: linear-gradient(135deg, #ff6b9e, #c2185b);
          border: none;
          color: #fff;
          padding: 13px 36px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(194, 24, 91, 0.45);
          transition: all 0.2s;
          letter-spacing: 0.3px;
        }
        .sp-btn-next:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(194, 24, 91, 0.55); }
        .sp-btn-submit {
          background: linear-gradient(135deg, #10b981, #059669);
          border: none;
          color: #fff;
          padding: 13px 36px;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.45);
          transition: all 0.2s;
        }
        .sp-btn-submit:hover:not(:disabled) { transform: translateY(-2px); }
        .sp-btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        @media (max-width: 480px) {
          .sp-nav-buttons { flex-direction: column-reverse; gap: 10px; }
          .sp-btn-back, .sp-btn-next, .sp-btn-submit { width: 100%; text-align: center; }
          .sp-progress-wrap { gap: 0; }
          .sp-connector { min-width: 8px; max-width: 40px; }
        }
      `}</style>
    </>
  );
};

export default Signup;