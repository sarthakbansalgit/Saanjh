import React from 'react'
import { Link } from 'react-router-dom'
import logo from './fimages/saanjh-logo.jpg'

const Navbar = () => {
  return (
    <>
      <header id="header" className="fixed-top d-flex align-items-center">
        <div className="container d-flex align-items-center justify-content-between">

          <div className="logo" style={{ lineHeight: 1 }}>
            <Link to="/" style={{ display: "inline-block", background: "#fff", borderRadius: "12px", padding: "4px 10px", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}>
              <img src={logo} alt="Saanjh" style={{ height: "65px", width: "auto", objectFit: "contain", display: "block" }} />
            </Link>
          </div>

          <nav id="navbar" class="navbar">
            <ul>
              <li><a className="nav-link scrollto active" href="/">Home</a></li>
              <li><a className="nav-link scrollto" href="#about" >About Us</a></li>
              {/* <li><a className="nav-link scrollto" href="/Services">Services</a></li> */}
              <li><a className="nav-link scrollto" href="#success">Success stories</a></li>
              {/* <li class="dropdown"><a href="#"><span>Drop Down</span> <i class="bi bi-chevron-down"></i></a>
            <ul>
              <li><a href="#">Drop Down 1</a></li>
              <li class="dropdown"><a href="#"><span>Deep Drop Down</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="#">Deep Drop Down 1</a></li>
                  <li><a href="#">Deep Drop Down 2</a></li>
                  <li><a href="#">Deep Drop Down 3</a></li>
                  <li><a href="#">Deep Drop Down 4</a></li>
                  <li><a href="#">Deep Drop Down 5</a></li>
                </ul>
              </li>
              <li><a href="#">Drop Down 2</a></li>
              <li><a href="#">Drop Down 3</a></li>
              <li><a href="#">Drop Down 4</a></li>
            </ul>
          </li> */}
              <li><Link className="getstarted scrollto" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))" }} to="/login">Login</Link></li>
              <li><Link className="getstarted scrollto" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))" }} to="/signup">Sign Up</Link></li>
              <li><Link className="getstarted scrollto" style={{ background: "linear-gradient(135deg, var(--primary-pink), var(--deep-pink))" }} to="/admin">Admin</Link></li>
            </ul>
            <i class="bi bi-list mobile-nav-toggle"></i>
          </nav>

        </div>
      </header>

    </>
  )
}

export default Navbar