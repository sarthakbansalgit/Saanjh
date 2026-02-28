import React, { useState } from 'react';
import Navbar from './fcomponents/Navbar';
import Footer from './fcomponents/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Admin = () => {
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5001/auth/adminlogin', creds, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (data.success) {
        localStorage.setItem('token', data.authToken);
        window.location = "/admin";
      } else {
        setErrorMsg(data.error || "Invalid Access");
      }
    } catch (error) {
      setErrorMsg("Invalid Credentials or Database connection issue.");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />

      <div className="py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') center/cover no-repeat fixed" }}>

        <div style={{ width: "100%", maxWidth: "450px", margin: "0 20px" }}>

          <div style={{ borderRadius: "30px", overflow: "hidden", background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" }}>

            {/* Header Box (Slightly altered hue for Admin mode) */}
            <div className="text-center py-4" style={{ background: "linear-gradient(135deg, #1f2937, #111827)", color: "white" }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: "bold", margin: 0 }}>Admin Portal</h2>
              <p className="mb-0 mt-2" style={{ opacity: 0.9 }}>Restricted system access</p>
            </div>

            <div className="p-4 p-md-5">
              {errorMsg && (
                <div className="alert alert-danger text-center" style={{ borderRadius: "15px", fontSize: "14px" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-4">
                  <label style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "8px", display: "block" }}>Admin Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={creds.email}
                    onChange={onChange}
                    required
                    className="form-control"
                    placeholder="Administrator Email"
                    style={{ borderRadius: "15px", padding: "12px 20px", border: "1px solid #ddd", background: "rgba(255,255,255,0.9)" }}
                  />
                </div>

                <div className="mb-4">
                  <label style={{ fontWeight: "bold", color: "var(--text-dark)", marginBottom: "8px", display: "block" }}>Master Password</label>
                  <input
                    type="password"
                    name="password"
                    value={creds.password}
                    onChange={onChange}
                    required
                    className="form-control"
                    placeholder="Secure Gateway Password"
                    style={{ borderRadius: "15px", padding: "12px 20px", border: "1px solid #ddd", background: "rgba(255,255,255,0.9)" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 my-3"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #1f2937, #111827)",
                    color: "white", borderRadius: "50px", padding: "12px",
                    fontWeight: "bold", border: "none",
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.4)",
                    fontSize: "16px"
                  }}
                >
                  {loading ? 'Authenticating...' : 'Secure Login'}
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Admin;