import React from 'react';


const GoogleLoginButton = () => {

    const handleLogin = () => {
        const googleAuthUrl = `${process.env.REACT_APP_API_URL}/api/users/auth/google`;
        window.location.href = googleAuthUrl;
    };

    return (
        <button
            className="flex items-center mt-20 justify-center w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-bold transition duration-300 hover:bg-gray-100"
            onClick={handleLogin}
        >
            <img
                src="https://img.icons8.com/color/48/000000/google-logo.png"
                alt="Google Logo"
                className="w-6 h-6 mr-2"
            />
            <span>Continue with Google</span>
        </button>

    );
};

export default GoogleLoginButton; 