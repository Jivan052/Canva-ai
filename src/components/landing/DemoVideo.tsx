import React from 'react';

const DemoVideo: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <h2 className="mb-6 text-2xl font-semibold">Demo Video</h2>

      <video
        controls
        className="w-full max-w-3xl mx-auto mb-8 rounded-lg shadow-lg"
      >
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button
        onClick={() => (window.location.href = '/')}
        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
      >
        Back to Home Page
      </button>
    </div>
  );
};

export default DemoVideo;
