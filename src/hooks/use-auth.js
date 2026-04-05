import { useCallback } from 'react';
import axios from 'axios';
import API from '../api';

export function useAuth() {
  const registerUser = useCallback(async (email, password, phone) => {
    // We strictly use the /auth/send-otp here.
    // The actual user creation happens after OTP via /auth/page1/createuser
    const res = await axios.post(`${API}/auth/send-otp`, { email });
    if (!res.data.success) {
      throw new Error(res.data.error || 'Failed to send OTP');
    }
    return { success: true };
  }, []);

  const verifyOTP = useCallback(async (email, otp) => {
    const res = await axios.post(`${API}/auth/verify-otp`, { email, otp });
    if (!res.data.success) {
      throw new Error(res.data.error || 'Invalid OTP');
    }
    return { success: true };
  }, []);

  const resendOTP = useCallback(async (email) => {
    const res = await axios.post(`${API}/auth/send-otp`, { email });
    if (!res.data.success) {
      throw new Error(res.data.error || 'Failed to resend OTP');
    }
    return { success: true };
  }, []);

  return { register: registerUser, verifyOTP, resendOTP };
}
