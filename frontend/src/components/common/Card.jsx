import React from 'react';

const Card = ({ 
  children, 
  variant = 'card', // 'card' or 'container'
  className = '', 
  ...props 
}) => {
  // Common base styles: Border, rounding, and backdrop blur
  const baseStyles = "relative overflow-hidden border border-white/20 font-inter transition-all duration-300";
  
  const variants = {
    // Glass Card: Higher opacity, stronger shadow, 3xl rounding
    card: "bg-white/10 backdrop-blur-md rounded-3xl shadow-custom",
    
    // Glass Container: Lower opacity, subtle 2xl rounding, no heavy shadow
    container: "bg-white/5 backdrop-blur-sm rounded-2xl",
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {/* Content wrapper to ensure padding is consistent */}
      <div className="p-lg h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default Card;