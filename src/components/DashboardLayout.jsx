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
        // Use navigate instead of window.location.href to stay within the HashRouter and correct base path
        navigate("/");
        window.location.reload(); // Reload to clear any remaining state and refresh App user check
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
