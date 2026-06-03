import React from "react";

const Modal = ({ open, children, onClose, className = "", zIndex = "z-50" }) => {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 ${className}`}
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  );
};

export default Modal;
