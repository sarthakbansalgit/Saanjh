import React from 'react';
import Navbardash from './dashboard/Navbardash';
import Navside from './dashboard/Navside';
import Footer from './dashboard/Footer';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isUpload");
        window.location.href = "/";
    };

    return (
        <div className="container-scroller">
            <Navbardash />
            <div className="container-fluid page-body-wrapper">
                <Navside handleLogout={handleLogout} />
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default DashboardLayout;
