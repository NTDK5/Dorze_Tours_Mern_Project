import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../services/paymentService';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const txRef = searchParams.get('tx_ref');

    useEffect(() => {
        const verifyTransaction = async () => {
            try {
                if (txRef) {
                    const response = await verifyPayment(txRef);
                    setStatus('success');
                    // Wait for 3 seconds before redirecting
                    setTimeout(() => {
                        navigate('/profile/booking_history');
                    }, 3000);
                }
            } catch (error) {
                setStatus('failed');
            }
        };

        verifyTransaction();
    }, [txRef, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto p-6">
                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                    {status === 'verifying' && (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFDA32] mx-auto"></div>
                            <h2 className="text-xl font-semibold mt-4">Verifying Payment...</h2>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold mt-4 text-green-600">
                                Payment Successful!
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Redirecting to your booking history...
                            </p>
                        </>
                    )}

                    {status === 'failed' && (
                        <>
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-red-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    ></path>
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold mt-4 text-red-600">
                                Payment Failed
                            </h2>
                            <p className="text-gray-600 mt-2">
                                There was an issue with your payment. Please try again.
                            </p>
                            <button
                                onClick={() => navigate(-1)}
                                className="mt-4 bg-[#FFDA32] text-white py-2 px-4 rounded hover:bg-[#F29404]"
                            >
                                Try Again
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess; 