import React from 'react';

function VerifyEmailPage() {
  //   const handleResendEmail = async () => {
  //     setResendLoading(true);
  //     setResendSuccess(false);
  //     setError(null);

  //     try {
  //       // Replace this URL with your actual API endpoint for resending verification emails
  //       const response = await fetch('/api/resend-verification-email', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         // Replace userEmail with the user's email
  //       });

  //       if (response.ok) {
  //         setResendSuccess(true);
  //       } else {
  //         const data = await response.json();
  //         setError(data.message || 'Something went wrong. Please try again.');
  //       }
  //     } catch (err) {
  //       setError('Network error. Please try again later.');
  //     } finally {
  //       setResendLoading(false);
  //     }
  //   };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-[#D5212C] mb-4">
          Verify Your Email
        </h1>
        <p className="text-center text-gray-700 mb-4">
          A verification link has been sent to your email address. Please check
          your email to verify your account.
        </p>

        <button className="w-full py-2 px-4 bg-[#F29404] text-white font-bold rounded hover:bg-[#D57F04] transition duration-200">
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
