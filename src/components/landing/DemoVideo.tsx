import React, { useRef, useState } from 'react';
import { Play, Pause, ArrowLeft, Sparkles } from 'lucide-react';

const DemoVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(false);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setShowControls(true);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowControls(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            See Our Product in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Action
            </span>
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Watch how our AI-powered analytics tool transforms your data into actionable insights in real-time.
          </p>
        </div>

        {/* Video Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <div 
            className="relative group cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={togglePlay}
          >
            {/* Video Container */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 bg-white dark:bg-slate-800 p-2">
              <video
                ref={videoRef}
                className="w-full rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                muted
                loop
                playsInline
              >
                <source src="https://res.cloudinary.com/djbjfsshe/video/upload/v1748538462/Demo-video_u7cpxh.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Play/Pause Overlay */}
              <div 
                className={`absolute inset-2 flex items-center justify-center bg-black/20 rounded-xl transition-all duration-300 ${
                  showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-center w-20 h-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 transition-all duration-300 hover:scale-110">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-slate-700 dark:text-white ml-0" />
                  ) : (
                    <Play className="w-8 h-8 text-slate-700 dark:text-white ml-1" />
                  )}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>

          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => (window.location.href = '/')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home Page
            
            {/* Shimmer effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 rounded-xl"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoVideo;