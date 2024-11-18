import React from 'react';
import loaderGif from '../assets/loading.gif';

function LoadingScreen() {
  return (
    <div className="absolute top-0 w-full flex items-center justify-center min-h-screen bg-white z-[1000]">
      <div className="flex flex-col items-center">
        <img src={loaderGif} alt="Loading..." className="w-40 h-40" />
        <p className="mt-4 text-2xl font-bold text-[#D5212C] animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
