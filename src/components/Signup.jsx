import API from '../api';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './fcomponents/Navbar';
import axios from 'axios';
import logo from '../saanjh-logo.jpg';
import './Signup.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

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
    if (!formRef.current) return udetails;
    const fd = new FormData(formRef.current);
    const data = Object.fromEntries(fd.entries());
    const merged = { ...udetails, ...data };
    setUdetails(merged);
    return merged;
  };

  const validateStep = (d) => {
    const newErrors = {};
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
    saveCurrentStepData(); 
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
    try {
      const { data } = await axios.post(`${API}/auth/page1/createuser`, currentData, {
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

  // Used for manual radio pills so we can see the selection easily
  const forceUpdateObj = (key, val) => {
    setUdetails(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  return (
    <>
      <Navbar />
      
      <div className="mobile-safe-page">
        <div className="mobile-safe-card">
          <div className="ms-header">
            <img src={logo} alt="Saanjh" className="ms-logo" />
            <h1 className="ms-title">Sign Up</h1>
            <p className="ms-subtitle">Find your perfect match.</p>
          </div>

          <div className="ms-progress">STEP {step} OF 4</div>

          {serverMsg && <div className="ms-server-error">⚠️ {serverMsg}</div>}

          <form ref={formRef} onSubmit={step === 4 ? handleSubmit : nextStep}>
            
            {/* STEP 1 */}
            <div style={{ display: step === 1 ? 'block' : 'none' }}>
              <div className="ms-field">
                <label className="ms-label">Creating Profile For</label>
                <div className="ms-radio-group">
                  {['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Relative'].map(opt => (
                    <div 
                      key={opt} 
                      className={`ms-radio-pill ${udetails.createdBy === opt ? 'selected' : ''}`}
                      onClick={() => forceUpdateObj('createdBy', opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                {/* Hidden input to satisfy FormData */}
                <input type="hidden" name="createdBy" value={udetails.createdBy} />
                {errors.createdBy && <span className="ms-error">{errors.createdBy}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-name">Full Name</label>
                <input id="m-name" name="name" type="text" defaultValue={udetails.name} className="ms-input" placeholder="Your full name" autoComplete="off" />
                {errors.name && <span className="ms-error">{errors.name}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-email">Email Address</label>
                <input id="m-email" name="email" type="email" defaultValue={udetails.email} className="ms-input" placeholder="Email" autoComplete="off" readOnly={!!sessionStorage.getItem('verifiedEmail')} style={{ background: sessionStorage.getItem('verifiedEmail') ? '#e5e7eb' : '' }} />
                {errors.email && <span className="ms-error">{errors.email}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-phone">Phone Number</label>
                <input id="m-phone" name="phone" type="number" defaultValue={udetails.phone} className="ms-input" placeholder="10-digit mobile number" autoComplete="off" />
                {errors.phone && <span className="ms-error">{errors.phone}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-pwd">Password</label>
                <input id="m-pwd" name="password" type="password" defaultValue={udetails.password} className="ms-input" placeholder="Min 8 characters" autoComplete="off" />
                {errors.password && <span className="ms-error">{errors.password}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-cpwd">Confirm Password</label>
                <input id="m-cpwd" name="cpassword" type="password" defaultValue={udetails.cpassword} className="ms-input" placeholder="Re-enter password" autoComplete="off" />
                {errors.cpassword && <span className="ms-error">{errors.cpassword}</span>}
              </div>
            </div>

            {/* STEP 2 */}
            <div style={{ display: step === 2 ? 'block' : 'none' }}>
              <div className="ms-field">
                <label className="ms-label">Gender</label>
                <div className="ms-radio-group">
                  {['Male', 'Female'].map(opt => (
                    <div 
                      key={opt} 
                      className={`ms-radio-pill ${udetails.gender === opt ? 'selected' : ''}`}
                      onClick={() => forceUpdateObj('gender', opt)}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
                <input type="hidden" name="gender" value={udetails.gender} />
                {errors.gender && <span className="ms-error">{errors.gender}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-age">Age</label>
                <input id="m-age" name="age" type="number" defaultValue={udetails.age} className="ms-input" placeholder="Your age" autoComplete="off" />
                {errors.age && <span className="ms-error">{errors.age}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-dob">Date of Birth</label>
                <input id="m-dob" name="dob" type="date" defaultValue={udetails.dob} className="ms-input" />
                {errors.dob && <span className="ms-error">{errors.dob}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-height">Height (cm)</label>
                <input id="m-height" name="height" type="number" defaultValue={udetails.height} className="ms-input" placeholder="e.g. 170" autoComplete="off" />
                {errors.height && <span className="ms-error">{errors.height}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-weight">Weight (kg)</label>
                <input id="m-weight" name="weight" type="number" defaultValue={udetails.weight} className="ms-input" placeholder="e.g. 65" autoComplete="off" />
                {errors.weight && <span className="ms-error">{errors.weight}</span>}
              </div>
            </div>

            {/* STEP 3 */}
            <div style={{ display: step === 3 ? 'block' : 'none' }}>
              <div className="ms-field">
                <label className="ms-label" htmlFor="m-rel">Religion</label>
                <select id="m-rel" name="religion" defaultValue={udetails.religion} className="ms-input ms-select">
                  <option value="">Select Religion</option>
                  {['Hindu', 'Muslim', 'Sikh', 'Christian', 'Jain', 'Parsi', 'No Religion'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                {errors.religion && <span className="ms-error">{errors.religion}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-caste">Caste</label>
                <input id="m-caste" name="caste" type="text" defaultValue={udetails.caste} className="ms-input" placeholder="Your caste" autoComplete="off" />
                {errors.caste && <span className="ms-error">{errors.caste}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-mot">Mother Tongue</label>
                <select id="m-mot" name="motherTongue" defaultValue={udetails.motherTongue} className="ms-input ms-select">
                  <option value="">Select Tongue</option>
                  {['Hindi', 'Punjabi', 'Marathi', 'Gujarati', 'Tamil', 'English', 'Other'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.motherTongue && <span className="ms-error">{errors.motherTongue}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-ms">Marital Status</label>
                <select id="m-ms" name="maritalStatus" defaultValue={udetails.maritalStatus} className="ms-input ms-select">
                  {['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                {errors.maritalStatus && <span className="ms-error">{errors.maritalStatus}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-state">State</label>
                <select id="m-state" name="state" defaultValue={udetails.state} className="ms-input ms-select">
                  <option value="">Select State</option>
                  {['Bihar', 'Delhi', 'Maharashtra', 'Punjab', 'Karnataka', 'Gujarat', 'Rajasthan', 'Uttar Pradesh', 'Tamil Nadu', 'West Bengal'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <span className="ms-error">{errors.state}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-dist">District / City</label>
                <input id="m-dist" name="district" type="text" defaultValue={udetails.district} className="ms-input" placeholder="Your city" autoComplete="off" />
                {errors.district && <span className="ms-error">{errors.district}</span>}
              </div>
            </div>

            {/* STEP 4 */}
            <div style={{ display: step === 4 ? 'block' : 'none' }}>
              <div className="ms-field">
                <label className="ms-label" htmlFor="m-ed">Highest Education</label>
                <select id="m-ed" name="education" defaultValue={udetails.education} className="ms-input ms-select">
                  <option value="">Select</option>
                  {['BTech/BE', 'MBA', 'MTech', 'BCA', 'MCA', 'MBBS', 'BCom', 'BA', 'High School', 'Other'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                {errors.education && <span className="ms-error">{errors.education}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-work">Working Sector</label>
                <select id="m-work" name="working" defaultValue={udetails.working} className="ms-input ms-select">
                  <option value="">Select</option>
                  {['Private Sector', 'Govt Sector', 'Business/Self Employed', 'Defense', 'Not Working'].map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                {errors.working && <span className="ms-error">{errors.working}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-desc">About Me</label>
                <textarea id="m-desc" name="description" defaultValue={udetails.description} placeholder="Share a bit about yourself... (min 30 characters)" className="ms-input ms-textarea" rows={4} autoComplete="off" />
                <span style={{fontSize: '11px', color: '#888', marginTop: '4px'}}>⚠️ No numbers or links allowed.</span>
                {errors.description && <span className="ms-error">{errors.description}</span>}
              </div>

              <div className="ms-field">
                <label className="ms-label" htmlFor="m-ppref">Partner Preferences</label>
                <textarea id="m-ppref" name="partnerPreference" defaultValue={udetails.partnerPreference} placeholder="What are you looking for in a partner?" className="ms-input ms-textarea" rows={4} autoComplete="off" />
                {errors.partnerPreference && <span className="ms-error">{errors.partnerPreference}</span>}
              </div>
            </div>

            <div className="ms-buttons">
              {step < 4 ? (
                <button type="submit" className="ms-btn-primary">Continue</button>
              ) : (
                <button type="submit" className="ms-btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              )}

              {step > 1 && (
                <button type="button" onClick={prevStep} className="ms-btn-secondary">Back</button>
              )}
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;