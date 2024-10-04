import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../states/slices/authSlice';
import { toast } from 'react-toastify';

function EmailVerification() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/verify-email?token=${token}`,
          {
            withCredentials: true,
          }
        );
        dispatch(setCredentials(response.data));
        toast.success('Email Verified successfully');
        navigate('/');
      } catch (error) {
        console.error('Email verification failed:', error);
      }
    };

    verifyEmail();
  }, [dispatch, navigate, location]);

  return <div>Verifying your email...</div>;
}

export default EmailVerification;
