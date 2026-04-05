
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Frontend from './components/Frontend';
import Signup from './components/Signup';
import Login from './components/Login';
import Portfolio from './components/fcomponents/Portfolio';
import Admin from './components/Admin';
import Main from './Main';
import DashboardLayout from './components/DashboardLayout';
import ALLprofiles from './components/dashboard/ALLprofiles';
import Searchprofile from './components/dashboard/Searchprofile';
import Myprofile from './components/dashboard/Myprofile';
import Messages from './components/dashboard/Messages';
import Chat from './components/dashboard/Chat';
import Forget from './components/Forget';
import Reset from './components/Reset';
import Pricing from './components/Pricing';
import EmailAuth from './components/EmailAuth';
import VerifyPage from './components/VerifyPage';

function App() {
  const user = localStorage.getItem("token");

  return (
    <>
      <Routes>

        {/* ── Dashboard routes – all share a single Navbardash + Navside ── */}
        {user && (
          <Route path="/" element={<DashboardLayout><ALLprofiles /></DashboardLayout>} />
        )}
        {user && (
          <Route path="/searchprofile" element={<DashboardLayout><Searchprofile /></DashboardLayout>} />
        )}
        {user && (
          <Route path="/profile" element={<DashboardLayout><Myprofile /></DashboardLayout>} />
        )}
        {user && (
          <Route path="/messages" element={<DashboardLayout><Messages /></DashboardLayout>} />
        )}
        {user && (
          <Route path="/chat" element={<DashboardLayout><Chat /></DashboardLayout>} />
        )}
        {user && (
          <Route path="/admin" element={<Main />} />
        )}

        {/* ── Public routes ── */}
        <Route path="/" element={<Frontend title="Saanjh" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forget-password" element={<Forget />} />
        <Route path="/reset-password" element={<Reset />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/portfolio" element={<Portfolio />} />

      </Routes>
    </>
  );
}

export default App;
