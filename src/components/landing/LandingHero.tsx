import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Play, TrendingUp, Zap, Database } from "lucide-react";

export default function LandingHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const rotatingWords = ["AI Insights", "Smart Analytics", "Data Magic", "Visual Stories"];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Geometric Patterns */}
        <div className="absolute top-1/5 right-1/4 w-32 h-32 border-2 border-blue-200/30 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-purple-200/60 rotate-12 animate-spin-slow"></div>
      </div>

      {/* Main Content Container */}
      <div className={`relative z-10 px-6 md:px-10 max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Hero Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 p-6 lg:pt-0">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 mb-6  shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-slate-700">AI-Powered Data Analysis</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-black tracking-tight mb-6 leading-tight">
              Transform Your Data  <br/> with{" "}
              <div className="relative inline-block">
                <span className="relative z-10 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text animate-gradient">
                  {rotatingWords[currentWord]}
                </span>
                <Sparkles className="inline-block w-6 h-6 md:w-8 md:h-8 text-blue-600 ml-2 animate-spin-slow" />
                
                {/* Dynamic Underline */}
                <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transform scale-x-0 animate-scale-x origin-left"></div>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 blur-xl bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-indigo-400/30 animate-pulse"></div>
              </div>
            </h1>
            
            {/* Subtitle */}
            <p className="text-md md:text-lg text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Upload your Excel sheets or connect Google Sheets and let our{" "}
              <span className="font-bold text-blue-600">AI generate comprehensive insights</span>{" "}
              and stunning visualizations automatically.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
              <button className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              </button>
              
              <button className="group flex items-center gap-2 px-6 py-3 border-2 border-slate-300 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-semibold rounded-full transition-all duration-300 hover:shadow-lg bg-white/80 backdrop-blur-sm">
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats/Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {[
                { icon: "⚡", title: "Instant Analysis", desc: "Results in seconds" },
                { icon: "🎯", title: "99% Accuracy", desc: "AI-powered insights" },
                { icon: "📊", title: "Beautiful Charts", desc: "Auto-generated visuals" }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-1 text-sm">{feature.title}</h3>
                  <p className="text-slate-600 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>


          {/* Right Column - Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end w-full h-3/4">
            <div className="relative group">
              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <img 
                  src="https://osiztechnologiesnew.s3.amazonaws.com/ai-tools-for-data-analytics.webp" 
                  alt="Data Analytics Dashboard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* Floating Stats Cards - Half Overlay Style */}
              {/* Top Right Card */}
              <div className="absolute top-0 -right-8 bg-white rounded-xl shadow-xl p-3 animate-float z-10">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold text-slate-700">+247%</span>
                </div>
              </div>
              
              {/* Bottom Left Card */}
              <div className="absolute bottom-20 -left-12 bg-white rounded-xl shadow-xl p-3 animate-float delay-1000 z-10">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold text-slate-700">Live Data</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes scale-x {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-scale-x {
          animation: scale-x 2s ease-out 0.5s forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}