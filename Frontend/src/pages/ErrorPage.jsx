import React from 'react';

const ErrorPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-6xl font-bold text-red-600">500</h1>
    <p className="text-xl mt-4">
      Something went wrong on our end. Please try again later.
    </p>
  </div>
);

export default ErrorPage;
