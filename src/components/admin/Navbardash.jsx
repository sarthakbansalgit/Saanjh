import React from 'react';
import logo from '../../saanjh-logo.jpg';

const Navbardash = () => {
  return (
    <>
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center" style={{ background: "#fff" }}>
          <a className="navbar-brand brand-logo" href="/">
            <img src={logo} alt="Saanjh" style={{ height: "50px", objectFit: "contain" }} />
          </a>
          <a className="navbar-brand brand-logo-mini" href="/">
            <img src={logo} alt="S" style={{ height: "34px", objectFit: "contain" }} />
          </a>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <ul className="navbar-nav mr-lg-2">
            <li className="nav-item nav-search d-none d-lg-block">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text" id="search">
                    <i className="icon-search"></i>
                  </span>
                </div>
                <input type="text" className="form-control" placeholder="Search" aria-label="search" aria-describedby="search" />
              </div>
            </li>
          </ul>
          <ul className="navbar-nav navbar-nav-right"></ul>
        </div>
      </nav>
    </>
  );
};

export default Navbardash;