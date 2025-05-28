import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import reviews from '@/pages/reviews-data.json';

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const Review = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const cardsPerView = 3;
  const maxIndex = Math.max(0, reviews.length - cardsPerView);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= maxIndex) {
          return 0; // Reset to beginning
        }
        return prev + 1;
      });
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [maxIndex, isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={cn(
          "transition-colors",
          index < rating ? 'text-yellow-400 fill-current' : 'text-muted/30'
        )}
      />
    ));
  };

  return (
    <section className="w-full bg-gradient-to-br from-muted/50 via-background to-muted/30 py-20 px-4 md:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block">
            <Badge variant="secondary" className="px-4 py-1 rounded-full font-medium">
              
              Customer Reviews
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          <span className="relative inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
            What Our Customers Say
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Discover how our customers are benefiting from our cutting-edge AI tools.
          </p>
          <Separator className="max-w-md mx-auto" />
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-20 rounded-full shadow-md",
              "bg-background/80 backdrop-blur-sm border-muted transition-all duration-300",
              "hover:translate-x-[-20px] hover:shadow-lg focus:ring-2 focus:ring-primary/20",
              currentIndex === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-20 rounded-full shadow-md",
              "bg-background/80 backdrop-blur-sm border-muted transition-all duration-300",
              "hover:translate-x-[20px] hover:shadow-lg focus:ring-2 focus:ring-primary/20",
              currentIndex >= maxIndex && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronRight size={20} />
          </Button>

          {/* Cards Container */}
          <div className="overflow-hidden px-8 py-4">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <Card className={cn(
                    "h-full group bg-background/70 backdrop-blur-sm border-border/40 transition-all duration-500",
                    "hover:shadow-lg hover:border-primary/20 hover:-translate-y-1 relative overflow-hidden"
                  )}>
                    {/* Quote icon */}
                    <div className="absolute top-4 right-4 text-muted/20 group-hover:text-primary/20 transition-colors duration-300">
                      <Quote size={28} />
                    </div>
                    
                    {/* Card Header */}
                    <CardHeader className="pb-2 relative z-10">
                      <Badge variant="outline" className="w-fit bg-primary/5 text-primary border-primary/20 mb-4">
                        {review.category}
                      </Badge>
                      
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm ring-2 ring-muted group-hover:ring-primary/20 transition-all duration-300">
                          <AvatarImage src={review.avatar} alt={review.name} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <AvatarFallback>{review.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="space-y-1">
                          <h4 className="font-medium text-base group-hover:text-primary transition-colors duration-300">
                            {review.name}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            {review.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            📍 {review.location}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex mr-2">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-muted-foreground">({review.rating}/5)</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="relative z-10">
                      <p className="text-sm text-foreground/80 italic">
                        "{review.review}"
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <div className="h-0.5 w-full bg-gradient-to-r from-primary/40 to-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </CardFooter>
                    
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full -translate-y-16 translate-x-16 opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(reviews.length / cardsPerView) }).map((_, index) => (
              <Button
                key={index}
                variant="ghost" 
                size="sm"
                className={cn(
                  "w-2 h-2 p-0 rounded-full",
                  index === Math.floor(currentIndex / cardsPerView) 
                    ? "bg-primary" 
                    : "bg-muted hover:bg-muted-foreground/50"
                )}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index * cardsPerView);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;