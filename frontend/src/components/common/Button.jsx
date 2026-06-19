import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon: Icon,
  iconOnly = false,
  fullWidth = false,
  className = "",
  iconPosition = "left",
  loading = false,
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
    gradient:
      "bg-gradient-to-r from-primary-blue to-blue-500 text-white shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110",
    danger: "bg-state-error text-white hover:brightness-110",
    dangerOutline:
      "border-2 border-state-error text-state-error hover:bg-state-error/10",
    link: "bg-transparent text-primary-blue hover:underline p-0 h-auto",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const iconPadding = iconOnly ? "px-0 w-12" : "gap-2";

  console.log("Button props:", { ...props, iconPosition, loading });
  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${widthStyle} ${iconPadding} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={iconOnly ? "w-6 h-6" : "w-5 h-5"} />
          )}
          {!iconOnly && children}
          {Icon && iconPosition === "right" && (
            <Icon className={iconOnly ? "w-6 h-6" : "w-5 h-5"} />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
