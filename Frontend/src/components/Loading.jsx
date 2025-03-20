import React from 'react';


function LoadingScreen() {
  return (
    <div className="absolute top-0 w-full flex items-center justify-center min-h-screen bg-white z-[1000]">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FFDA32]"></div>
        <p className="mt-4 text-2xl font-bold text-[#D5212C] animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default LoadingScreen;
