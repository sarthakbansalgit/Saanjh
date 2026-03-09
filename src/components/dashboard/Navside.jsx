import API from '../../api';
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import userImage from './img/user.png'


const Navside = (props) => {


  const [user, setUser] = useState("");




  useEffect(() => {

    getUser();
  },)


  async function getUser() {
    try {
      const response = await axios.get(`${API}/auth/getuser`, {
        mode: 'no-cors',
        headers: {
          "auth-token": `${localStorage.getItem('token')}`
        }
      }).then((res) => {
        setUser(res.data.name);
      }).catch(err => console.log(err))
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }












  const handleNavClick = () => {
    const sidebar = document.querySelector('.sidebar-offcanvas');
    if (sidebar) {
      sidebar.classList.remove('active');
    }
  };

  return (
    <>

      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="user-profile">
          <div className="user-image">

            <img src={userImage} alt='user' />

          </div>
          <div className="user-name">
            {user}
          </div>

        </div>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href="#/profile" onClick={handleNavClick}>
              {/* <i className="icon-box menu-icon"></i> */}
              <span className="menu-title">My Profile</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#/" onClick={handleNavClick}>
              <span className="menu-title">Search Profiles</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#/chat" onClick={handleNavClick}>
              <span className="menu-title">Live Chat</span>
            </a>
          </li>


          <li className="nav-item">
            <a className="nav-link" href="#/messages" onClick={handleNavClick}>
              <span className="menu-title">Messages</span>
            </a>
          </li>



          <li className="nav-item">
            <button onClick={() => { handleNavClick(); props.handleLogout(); }} className='btn btn-outline-secondary nav-link' style={{ border: "none" }}>Logout</button>
          </li>



        </ul>

      </nav>





    </>
  )
}


export default Navside


