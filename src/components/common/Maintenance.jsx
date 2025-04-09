import React from "react";

const Maintenance = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="text-center p-8 max-w-xl bg-white rounded-2xl shadow-2xl animate-fadeIn">
        <div className="text-6xl mb-4 animate-bounce">🚧</div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Site Under Maintenance
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          We're making some improvements to give you a better experience.
        </p>
        <p className="mt-2 text-gray-500">Hang tight, we'll be back soon. 🙏</p>
        <div className="mt-6">
          <span className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full animate-pulse">
            Estimated Downtime: Short
          </span>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
