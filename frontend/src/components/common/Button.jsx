import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconOnly = false,
  fullWidth = false,
  className = "",
  ...props
}) => {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center transition-all duration-200 overflow-hidden font-inter active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";

  // Size Mapping
  const sizes = {
    small: "h-9 px-md text-body-small-bold rounded-2xl",
    medium: "h-12 px-lg text-body-medium-bold rounded-2xl",
    large: "h-14 px-xl text-body-large-bold rounded-2xl",
  };

  // Variant Mapping
  const variants = {
    primary:
      "bg-primary-blue text-white shadow-custom hover:brightness-110 active:bg-blue-700",
    outline:
      "border-2 border-primary-blue text-primary-blue hover:bg-primary-light active:bg-primary-blue/20",
    secondary: "bg-dark-4 text-text-soft hover:bg-dark-2 active:bg-dark-1",
    ghost: "bg-transparent text-text-secondary hover:bg-white/10",
    "ghost-hoverless":
      "bg-transparent text-text-secondary hover:opacity-80 transition-opacity !overflow-visible",
    danger: "bg-state-error text-white hover:brightness-110",
    dangerOutline:
      "border-2 border-state-error text-state-error hover:bg-state-error/10",
    link: "bg-transparent text-primary-blue hover:underline p-0 h-auto",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const iconPadding = iconOnly ? "px-0 w-12" : "gap-2";

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthStyle} ${iconPadding} ${className}`}
      {...props}
    >
      {Icon && <Icon className={iconOnly ? "w-6 h-6" : "w-5 h-5"} />}
      {!iconOnly && children}
    </button>
  );
};

export default Button;
