/* eslint-disable react/no-unescaped-entities */

import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const FormAuthGuard = ({ children, formTitle = 'this form' }) => {
    const { userInfo } = useSelector((state) => state.auth);

    if (!userInfo) {
        return (
            <div className="bg-white rounded-lg shadow-md p-8 my-4 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="bg-yellow-100 p-4 rounded-full">
                        <FaLock className="text-4xl text-[#F29404]" />
                    </div>
                    <h3 className="text-2xl font-bold">Authentication Required</h3>
                    <p className="text-gray-600 mb-4">
                        You need to be logged in to access {formTitle}.
                    </p>
                    <Link
                        to="/login"
                        className="bg-gradient-to-r from-[#FFDA32] to-[#F29404] text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-all"
                    >
                        Sign In
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#F29404] hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default FormAuthGuard; 