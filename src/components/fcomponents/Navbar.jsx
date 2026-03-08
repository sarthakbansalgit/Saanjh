import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from './fimages/saanjh-logo.jpg'

const Navbar = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Mobile menu inline styles guaranteed to work:
  const mobileMenuStyles = {
    position: 'fixed',
    top: 0, right: 0, bottom: 0, left: 0,
    backgroundColor: '#fff',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    transition: '0.3s all ease',
    overflowY: 'auto',
    padding: '20px'
  };

  const linkStyles = {
    fontSize: '22px', color: '#4e4039', fontWeight: 'bold', textDecoration: 'none'
  };

  const btnStyles = {
    background: "linear-gradient(135deg, #fb6f92, #ff8fab)",
    color: "#fff",
    padding: "12px 35px",
    borderRadius: "50px",
    fontSize: "20px",
    textDecoration: "none",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(251, 111, 146, 0.3)"
  };

  return (
    <>
      <header id="header" className="fixed-top d-flex align-items-center" style={{ zIndex: 998 }}>
        <div className="container d-flex align-items-center justify-content-between">
          <div className="logo" style={{ lineHeight: 1 }}>
            <Link to="/" style={{ display: "inline-block", background: "#fff", borderRadius: "12px", padding: "4px 10px", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
              <img src={logo} alt="Saanjh" style={{ height: "65px", width: "auto", objectFit: "contain", display: "block" }} />
            </Link>
          </div>

          <nav id="navbar" className="navbar">
            <ul className="d-none d-lg-flex" style={{ display: "none" }}>
              <li><Link className="nav-link scrollto active" to="/">Home</Link></li>
              <li><a className="nav-link scrollto" href="#about">About Us</a></li>
              <li><a className="nav-link scrollto" href="#success">Success stories</a></li>
              <li><Link className="getstarted scrollto" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "#fff" }} to="/login">Login</Link></li>
              <li><Link className="getstarted scrollto" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "#fff" }} to="/signup">Sign Up</Link></li>
              <li><Link className="getstarted scrollto" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))", color: "#fff" }} to="/admin">Admin</Link></li>
            </ul>
            <div className="d-lg-none" style={{ cursor: 'pointer', fontSize: '38px', color: '#7a6960', lineHeight: 1, padding: '5px' }} onClick={() => setIsMobileNavOpen(true)}>
              ☰
            </div>
          </nav>
        </div>
      </header>

      {/* OVERLAY MOBILE MENU - GUARANTEED TO OVERLAP EVERYTHING */}
      {isMobileNavOpen && (
        <div style={mobileMenuStyles}>
          <div style={{ position: 'absolute', top: '25px', right: '30px', fontSize: '45px', cursor: 'pointer', color: '#7a6960', lineHeight: 1 }} onClick={() => setIsMobileNavOpen(false)}>
            ✕
          </div>
          <Link style={linkStyles} to="/" onClick={() => setIsMobileNavOpen(false)}>Home</Link>
          <a style={linkStyles} href="#about" onClick={() => setIsMobileNavOpen(false)}>About Us</a>
          <a style={linkStyles} href="#success" onClick={() => setIsMobileNavOpen(false)}>Success stories</a>
          <div style={{ height: "10px", width: "100%", borderBottom: "1px solid #eee" }}></div>
          <Link style={btnStyles} to="/login" onClick={() => setIsMobileNavOpen(false)}>Login</Link>
          <Link style={btnStyles} to="/signup" onClick={() => setIsMobileNavOpen(false)}>Sign Up</Link>
          <Link style={btnStyles} to="/admin" onClick={() => setIsMobileNavOpen(false)}>Admin</Link>
        </div>
      )}
    </>
  )
}

export default Navbar