import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import reviews from '@/pages/reviews-data.json'

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);


  const cardsPerView = 3;
  const maxIndex = Math.max(0, reviews.length - cardsPerView);

  // Auto-scroll functionality
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) {
          return 0; // Reset to beginning
        }
        return prev + 1;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [maxIndex, isAutoPlaying]);

  const goToPrevious = () => {
    // setIsAutoPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    // setIsAutoPlaying(false);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };


  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              Customer Reviews
            </span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 mb-4 max-w-4xl mx-auto leading-relaxed">
            Discover how our customers are benefiting from our cutting-edge AI tools.
          </p>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            use Camel AI
          </p>
        </div>


        {/* Reviews Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-20 p-4 rounded-full shadow-xl transition-all duration-300 backdrop-blur-sm ${
              currentIndex === 0 
                ? 'bg-gray-200/80 text-gray-400 cursor-not-allowed' 
                : 'bg-white/90 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-2xl hover:scale-110'
            }`}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-20 p-4 rounded-full shadow-xl transition-all duration-300 backdrop-blur-sm ${
              currentIndex >= maxIndex 
                ? 'bg-gray-200/80 text-gray-400 cursor-not-allowed' 
                : 'bg-white/90 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-2xl hover:scale-110'
            }`}
          >
            <ChevronRight size={24} />
          </button>

            {/* Cards Container */}
            <div className="overflow-hidden px-12 py-4 rounded-3xl">
                <div 
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                    transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
                }}
                >
                {reviews.map((review, index) => (
                    <div
                    key={review.id}
                    className="flex-shrink-0 px-4"
                    style={{ width: `${100 / cardsPerView}%` }}
                    >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 p-8 h-full border border-gray-100/50 relative overflow-hidden group">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        
                        {/* Quote icon */}
                        <div className="absolute top-6 right-6 text-blue-200 group-hover:text-blue-300 transition-colors duration-300">
                        <Quote size={32} />
                        </div>

                        {/* Category Badge */}
                        <div className="mb-6 relative z-10">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold rounded-full border border-blue-200">
                            {review.category}
                        </span>
                        </div>

                        {/* User Profile Section */}
                        <div className="flex items-start mb-6 relative z-10">
                        {/* Circular Avatar */}
                        <div className="flex-shrink-0 mr-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                            <img 
                                src={review.avatar} 
                                alt={review.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            </div>
                        </div>
                        
                        {/* Name and Title */}
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">
                            {review.name}
                            </h4>
                            <p className="text-gray-600 text-sm mb-1 leading-relaxed">
                            {review.title}
                            </p>
                            <p className="text-gray-500 text-xs font-medium">
                            📍 {review.location}
                            </p>
                        </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mb-4 relative z-10">
                        <div className="flex mr-2">
                            {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">({review.rating}/5)</span>
                        </div>

                        {/* Review Content */}
                        <div className="mb-6 relative z-10">
                        <p className="text-gray-700 text-base leading-relaxed italic font-medium">
                            "{review.review}"
                        </p>
                        </div>

                        {/* Bottom decorative line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Review;