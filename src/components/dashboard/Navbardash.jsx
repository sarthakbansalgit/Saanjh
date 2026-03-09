import React from 'react';
import logo from '../../saanjh-logo.jpg';


const Navbardash = () => {




  return (
    <>


      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center" style={{ background: "#fff" }}>
          <a className="navbar-brand brand-logo" href="#/">
            <img src={logo} alt="Saanjh" style={{ height: "52px", objectFit: "contain" }} />
          </a>
          <a className="navbar-brand brand-logo-mini" href="#/">
            <img src={logo} alt="S" style={{ height: "36px", objectFit: "contain" }} />
          </a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <button className="navbar-toggler navbar-toggler align-self-center d-none d-lg-block" onClick={() => document.body.classList.toggle('sidebar-icon-only')} type="button" data-toggle="minimize" style={{ border: "none" }}>
            <span className="fa fa-bars fs-4" style={{ color: "var(--deep-pink)" }}></span>
          </button>
          <ul className="navbar-nav mr-lg-2">
            <li className="nav-item nav-search d-none d-lg-block">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="search" style={{ borderRight: "none" }}>
                    <i className="fa fa-search"></i>
                  </span>
                </div>
                <input type="text" className="form-control" placeholder="Search" aria-label="search" aria-describedby="search" style={{ borderLeft: "none" }} />
              </div>
            </li>
          </ul>
          <ul className="navbar-nav navbar-nav-right">

            {/* <button className='nav-item btn btn-outline-primary' onClick={handleLogout}>Logout</button> */}

          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" onClick={() => document.querySelector('.sidebar-offcanvas').classList.toggle('active')} type="button" data-toggle="offcanvas" style={{ border: "none" }}>
            <span className="fa fa-bars fs-4" style={{ color: "var(--deep-pink)" }}></span>
          </button>
        </div>
      </nav>







    </>
  )
}

export default Navbardash