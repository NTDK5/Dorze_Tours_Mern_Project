import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../states/slices/authSlice';

const GoogleAuthHandler = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            dispatch(setCredentials(user));
            // localStorage.setItem('userInfo', JSON.stringify(user)); // Store user info

            // Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [dispatch, navigate]);

    return <div>Authenticating...</div>;
};

export default GoogleAuthHandler;
