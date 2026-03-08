import API from '../../api';
import React, { useState, useEffect } from 'react';
import Sendmail from './Sendmail';
import axios from 'axios';

const UserProfile = ({ user, isFree }) => {


  const [myuser, setMyUser] = useState({ name: "", email: "" });

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const response = await axios.get(`${API}/auth/getuser`, {
        headers: {
          "auth-token": localStorage.getItem('token')
        }
      });

      setMyUser({
        name: response.data.name,
        email: response.data.email
      });
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <>
      <div className='d-flex flex-column'>
        <div className='text-center mb-4'>
          <img src={`${API}/${user.image || 'uploads/default.png'}`} style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "50%", boxShadow: "0 10px 20px rgba(251, 111, 146, 0.3)", border: "4px solid var(--primary-pink)", filter: isFree ? "blur(20px)" : "none", transition: "all 0.3s ease" }} alt="User" />

          {isFree && <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>Image Blurred - Upgrade to Premium</p>}

          <h3 style={{ margin: "15px 0 5px 0", fontSize: "28px", color: "var(--deep-pink)", fontFamily: "'Playfair Display', serif" }}><b>{user.name}</b></h3>
          <p style={{ color: "var(--text-dark)", margin: "0", fontSize: "16px" }}>📍 {user.state}, {user.district}</p>
        </div>

        <div className='profile-details' style={{ background: "rgba(255, 255, 255, 0.6)", padding: "20px", borderRadius: "15px", border: "1px solid var(--glass-border)", marginBottom: "20px" }}>

          <h4 style={{ color: "var(--primary-pink)", borderBottom: "1px solid rgba(251, 111, 146, 0.3)", paddingBottom: "10px", marginBottom: "15px" }}>Basic Information</h4>
          <div className="row">
            <div className="col-md-6"><p><b>Gender:</b> {user.gender}</p></div>
            <div className="col-md-6"><p><b>Age:</b> {user.age} Years</p></div>
            <div className="col-md-6"><p><b>DOB:</b> {user.dob}</p></div>
            <div className="col-md-6"><p><b>Marital Status:</b> {user.maritalStatus || "Never Married"}</p></div>
          </div>

          <h4 style={{ color: "var(--primary-pink)", borderBottom: "1px solid rgba(251, 111, 146, 0.3)", paddingBottom: "10px", margin: "15px 0" }}>Background</h4>
          <div className="row">
            <div className="col-md-6"><p><b>Religion:</b> {user.religion || "Not Specified"}</p></div>
            <div className="col-md-6"><p><b>Caste:</b> {user.caste}</p></div>
            <div className="col-md-6"><p><b>Mother Tongue:</b> {user.motherTongue || "Not Specified"}</p></div>
          </div>

          <h4 style={{ color: "var(--primary-pink)", borderBottom: "1px solid rgba(251, 111, 146, 0.3)", paddingBottom: "10px", margin: "15px 0" }}>Education & Career</h4>
          <div className="row">
            <div className="col-md-6"><p><b>Education:</b> {user.education}</p></div>
            <div className="col-md-6"><p><b>Working Sector:</b> {user.working}</p></div>
          </div>

          <h4 style={{ color: "var(--primary-pink)", borderBottom: "1px solid rgba(251, 111, 146, 0.3)", paddingBottom: "10px", margin: "15px 0" }}>Physical Attributes</h4>
          <div className="row">
            <div className="col-md-6"><p><b>Height:</b> {user.height} cm</p></div>
            <div className="col-md-6"><p><b>Weight:</b> {user.weight} kg</p></div>
          </div>
        </div>

        <div className="desc my-2 px-2" style={{ background: "rgba(255, 255, 255, 0.6)", padding: "20px", borderRadius: "15px", border: "1px solid var(--glass-border)" }}>
          <h4 style={{ color: "var(--primary-pink)", borderBottom: "1px solid rgba(251, 111, 146, 0.3)", paddingBottom: "10px", marginBottom: "10px" }}>About Me</h4>
          <p style={{ lineHeight: "1.6" }}>{user.description || user.about || "No description provided."}</p>
        </div>
      </div>

      <div style={{ marginTop: "20px", background: "rgba(255, 255, 255, 0.6)", padding: "20px", borderRadius: "15px", border: "1px solid var(--glass-border)" }}>
        <h4 style={{ color: "var(--primary-pink)", marginBottom: "15px" }}>Send Message Request</h4>
        <Sendmail email={user.email} name={myuser.name} customer={myuser.email} />
      </div>
    </>

  );
};

export default UserProfile;
