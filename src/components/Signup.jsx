import API from '../api';
import React, { useState, useEffect, useRef } from 'react';
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
  const formRef = useRef(null);

  // We only hold state for the data when transitioning steps. 
  // No onChange re-rendering while typing.
  const [udetails, setUdetails] = useState({
    name: '', age: '', email: '', phone: '', caste: '', dob: '',
    state: '', district: '', height: '', weight: '', education: '',
    working: '', password: '', description: '', gender: '',
    cpassword: '', religion: '', motherTongue: '', maritalStatus: 'Never Married',
    partnerPreference: '', createdBy: 'Self'
  });

  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem('verifiedEmail');
    if (verifiedEmail) {
      setUdetails(prev => ({ ...prev, email: verifiedEmail }));
    }
  }, []);

  const saveCurrentStepData = () => {
    if (!formRef.current) return {};
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    setUdetails(prev => ({ ...prev, ...data }));
    return data;
  };

  const validateStep = (data) => {
    const newErrors = {};
    const d = { ...udetails, ...data }; // merged active view
    
    if (step === 1) {
      if (!d.createdBy) newErrors.createdBy = 'Required';
      if (!d.name || !d.name.trim()) newErrors.name = 'Required';
      if (!d.email || !d.email.trim()) newErrors.email = 'Required';
      if (!d.phone || !d.phone.trim() || d.phone.length !== 10) newErrors.phone = 'Valid 10-digit number required';
      if (!d.password || d.password.length < 8) newErrors.password = 'Min 8 characters';
      if (d.password !== d.cpassword) newErrors.cpassword = 'Passwords do not match';
    } else if (step === 2) {
      if (!d.gender) newErrors.gender = 'Required';
      if (!d.age || d.age < 18 || d.age > 100) newErrors.age = 'Age 18–100';
      if (!d.dob) newErrors.dob = 'Required';
      if (!d.height) newErrors.height = 'Required';
      if (!d.weight) newErrors.weight = 'Required';
    } else if (step === 3) {
      if (!d.religion) newErrors.religion = 'Required';
      if (!d.motherTongue) newErrors.motherTongue = 'Required';
      if (!d.caste) newErrors.caste = 'Required';
      if (!d.maritalStatus) newErrors.maritalStatus = 'Required';
      if (!d.state) newErrors.state = 'Required';
      if (!d.district) newErrors.district = 'Required';
    } else if (step === 4) {
      if (!d.education) newErrors.education = 'Required';
      if (!d.working) newErrors.working = 'Required';
      if (!d.description || d.description.trim().length < 30) newErrors.description = 'Min 30 chars';
      if (!d.partnerPreference) newErrors.partnerPreference = 'Required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = (e) => {
    e.preventDefault();
    const currentData = saveCurrentStepData();
    if (validateStep(currentData)) {
      setStep(s => s + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    saveCurrentStepData(); // save whatever they typed so far if they go back
    setErrors({});
    setStep(s => s - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg('');
    const currentData = saveCurrentStepData();
    if (!validateStep(currentData)) return;
    
    setLoading(true);
    const finalPayload = { ...udetails, ...currentData };
    
    try {
      const { data } = await axios.post(`${API}/auth/page1/createuser`, finalPayload, {
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
        setServerMsg(err.response.data.errors.map(err => err.msg).join(', '));
      } else if (err.response?.data?.error) {
        setServerMsg(err.response.data.error);
      } else {
        setServerMsg('Server error. Please check connection.');
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="sp-page-native">
        {/* We use an absolute background to avoid iOS Safari 'fixed' repainting bugs causing keyboard drop */}
        <div className="sp-bg-img" style={{ backgroundImage: `url('${BG}')` }} />
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

          <form ref={formRef} onSubmit={step === 4 ? handleSubmit : nextStep} className="sp-form native-form">
            
            {/* STEP 1 */}
            <div style={{ display: step === 1 ? 'block' : 'none' }} className="sp-step-section">
              <h2 className="sp-step-title">Basic Account Setup</h2>
              
              <div className="sp-field">
                <label className="sp-label">Profile Creating For</label>
                <select name="createdBy" defaultValue={udetails.createdBy} className="sp-input">
                  <option value="Self">Self</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Friend">Friend</option>
                  <option value="Relative">Relative</option>
                </select>
                {errors.createdBy && <span className="sp-error">{errors.createdBy}</span>}
              </div>

              <div className="sp-grid-2">
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-n">Full Name</label>
                  <input id="s-n" name="name" type="text" defaultValue={udetails.name} className="sp-input" placeholder="Your full name" />
                  {errors.name && <span className="sp-error">{errors.name}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-e">Email Address</label>
                  <input id="s-e" name="email" type="email" defaultValue={udetails.email} className="sp-input" placeholder="Email" readOnly={!!sessionStorage.getItem('verifiedEmail')} style={{ background: sessionStorage.getItem('verifiedEmail') ? 'rgba(255,255,255,0.4)' : '' }} />
                  {errors.email && <span className="sp-error">{errors.email}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-p">Phone Number</label>
                  <input id="s-p" name="phone" type="number" defaultValue={udetails.phone} className="sp-input" placeholder="10-digit mobile number" />
                  {errors.phone && <span className="sp-error">{errors.phone}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-pwd">Password</label>
                  <input id="s-pwd" name="password" type="password" defaultValue={udetails.password} className="sp-input" placeholder="Min 8 characters" />
                  {errors.password && <span className="sp-error">{errors.password}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-cpwd">Confirm Password</label>
                  <input id="s-cpwd" name="cpassword" type="password" defaultValue={udetails.cpassword} className="sp-input" placeholder="Re-enter password" />
                  {errors.cpassword && <span className="sp-error">{errors.cpassword}</span>}
                </div>
              </div>
            </div>

            {/* STEP 2 */}
            <div style={{ display: step === 2 ? 'block' : 'none' }} className="sp-step-section">
              <h2 className="sp-step-title">Personal Details</h2>
              <div className="sp-field">
                <label className="sp-label">Gender</label>
                <select name="gender" defaultValue={udetails.gender} className="sp-input">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                {errors.gender && <span className="sp-error">{errors.gender}</span>}
              </div>
              <div className="sp-grid-2">
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-age">Age</label>
                  <input id="s-age" name="age" type="number" defaultValue={udetails.age} className="sp-input" placeholder="Your age" />
                  {errors.age && <span className="sp-error">{errors.age}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-dob">Date of Birth</label>
                  <input id="s-dob" name="dob" type="date" defaultValue={udetails.dob} className="sp-input" />
                  {errors.dob && <span className="sp-error">{errors.dob}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-height">Height (cm)</label>
                  <input id="s-height" name="height" type="number" defaultValue={udetails.height} className="sp-input" placeholder="e.g. 170" />
                  {errors.height && <span className="sp-error">{errors.height}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-weight">Weight (kg)</label>
                  <input id="s-weight" name="weight" type="number" defaultValue={udetails.weight} className="sp-input" placeholder="e.g. 65" />
                  {errors.weight && <span className="sp-error">{errors.weight}</span>}
                </div>
              </div>
            </div>

            {/* STEP 3 */}
            <div style={{ display: step === 3 ? 'block' : 'none' }} className="sp-step-section">
              <h2 className="sp-step-title">Background &amp; Location</h2>
              <div className="sp-grid-2">
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-rel">Religion</label>
                  <select id="s-rel" name="religion" defaultValue={udetails.religion} className="sp-input">
                    <option value="">Select Religion</option>
                    {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Parsi', 'No Religion'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.religion && <span className="sp-error">{errors.religion}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-caste">Caste</label>
                  <input id="s-caste" name="caste" type="text" defaultValue={udetails.caste} className="sp-input" placeholder="Your caste" />
                  {errors.caste && <span className="sp-error">{errors.caste}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-mot">Mother Tongue</label>
                  <select id="s-mot" name="motherTongue" defaultValue={udetails.motherTongue} className="sp-input">
                    <option value="">Select Tongue</option>
                    {['Hindi', 'Punjabi', 'Marathi', 'Gujarati', 'Tamil', 'English'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.motherTongue && <span className="sp-error">{errors.motherTongue}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-ms">Marital Status</label>
                  <select id="s-ms" name="maritalStatus" defaultValue={udetails.maritalStatus} className="sp-input">
                    {['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed'].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {errors.maritalStatus && <span className="sp-error">{errors.maritalStatus}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-state">State</label>
                  <select id="s-state" name="state" defaultValue={udetails.state} className="sp-input">
                    <option value="">Select State</option>
                    {['Bihar', 'Delhi', 'Maharashtra', 'Punjab', 'Karnataka', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'West Bengal'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="sp-error">{errors.state}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-dist">District / City</label>
                  <input id="s-dist" name="district" type="text" defaultValue={udetails.district} className="sp-input" placeholder="Your city" />
                  {errors.district && <span className="sp-error">{errors.district}</span>}
                </div>
              </div>
            </div>

            {/* STEP 4 */}
            <div style={{ display: step === 4 ? 'block' : 'none' }} className="sp-step-section">
              <h2 className="sp-step-title">Education &amp; Lifestyle</h2>
              <div className="sp-grid-2">
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-ed">Highest Education</label>
                  <select id="s-ed" name="education" defaultValue={udetails.education} className="sp-input">
                    <option value="">Select</option>
                    {['BTech/BE', 'MBA', 'MTech', 'BCA', 'MCA', 'MBBS', 'BCom', 'BA', 'High School', 'Other'].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {errors.education && <span className="sp-error">{errors.education}</span>}
                </div>
                <div className="sp-field">
                  <label className="sp-label" htmlFor="s-work">Working Sector</label>
                  <select id="s-work" name="working" defaultValue={udetails.working} className="sp-input">
                    <option value="">Select</option>
                    {['Private Sector', 'Govt Sector', 'Business/Self Employed', 'Defense', 'Not Working'].map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  {errors.working && <span className="sp-error">{errors.working}</span>}
                </div>
              </div>
              <div className="sp-field">
                <label className="sp-label" htmlFor="s-desc">About Me</label>
                <textarea id="s-desc" name="description" defaultValue={udetails.description} placeholder="Share a bit about yourself... (min 30 characters)" className="sp-input sp-textarea" rows={4} />
                <small className="sp-note">⚠️ Do not share mobile numbers or social links — they will be removed.</small>
                {errors.description && <span className="sp-error">{errors.description}</span>}
              </div>
              <div className="sp-field">
                <label className="sp-label" htmlFor="s-ppref">Partner Preferences</label>
                <textarea id="s-ppref" name="partnerPreference" defaultValue={udetails.partnerPreference} placeholder="What are you looking for in a partner?" className="sp-input sp-textarea" rows={4} />
                {errors.partnerPreference && <span className="sp-error">{errors.partnerPreference}</span>}
              </div>
            </div>

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