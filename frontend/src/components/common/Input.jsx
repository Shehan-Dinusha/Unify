import React from "react";

const Input = React.forwardRef(
  (
    { label, error, icon: Icon, rightElement, className = "", ...props },
    ref,
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 w-full ${className}`}>
        {label && (
          <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative group">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary-blue transition-colors z-10">
              <Icon size={20} />
            </div>
          )}

          <input
            ref={ref}
            className={`
            w-full h-12 rounded-2xl bg-white/5 border outline-none transition-all
            font-inter text-sm text-text-primary placeholder:text-text-tertiary
            shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
            autofill:shadow-[inset_0_0_0px_1000px_#1B2735] autofill:text-fill-white
            ${Icon ? "pl-12" : "px-4"}
            ${rightElement ? "pr-12" : "pr-4"}
            ${
              error
                ? "border-state-error/50 focus:border-state-error"
                : "border-white/10 focus:border-primary-blue/50 focus:bg-white/10"
            }
          `}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white transition-colors cursor-pointer z-10 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <span className="text-state-error text-xs font-normal font-inter leading-5 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
