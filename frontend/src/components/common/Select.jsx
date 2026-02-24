import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Custom Select component for Unify Design System.
 * Bypasses native browser styling to support rounded-2xl dropdown panels
 * and consistent visual language with the Input component.
 */
const Select = React.forwardRef(
  (
    {
      label,
      error,
      icon: Icon,
      options = [],
      value,
      onChange,
      placeholder = "Select Option",
      className = "",
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const { disabled } = props;

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (option) => {
      if (disabled) return;
      // Simulate an event object for compatibility with standard handleChange functions
      onChange({
        target: {
          name: props.name,
          value: option.value,
        },
      });
      setIsOpen(false);
    };

    return (
      <div
        className={`flex flex-col gap-1.5 w-full relative ${className}`}
        ref={containerRef}
      >
        {label && (
          <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
            {label}
          </label>
        )}

        <div className="relative group">
          {Icon && (
            <div
              className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${
                isOpen ? "text-primary-blue" : "text-text-secondary"
              }`}
            >
              <Icon size={20} />
            </div>
          )}

          <button
            type="button"
            ref={ref}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`
            w-full h-12 flex items-center justify-between rounded-2xl bg-white/5 border outline-none transition-all
            font-inter text-sm text-left
            shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
            ${Icon ? "pl-12" : "px-4"}
            pr-12
            ${
              disabled
                ? "opacity-50 cursor-not-allowed border-white/5 bg-transparent"
                : error
                  ? "border-state-error/50"
                  : isOpen
                    ? "border-primary-blue/50 bg-white/10"
                    : "border-white/10 group-hover:border-white/20"
            }
            ${selectedOption ? "text-text-primary" : "text-text-tertiary"}
          `}
            {...props}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </button>

          <div
            className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 ${
              isOpen ? "text-primary-blue rotate-180" : "text-text-tertiary"
            } ${disabled ? "opacity-30" : ""}`}
          >
            <ChevronDown size={18} />
          </div>

          {/* Custom Dropdown Panel */}
          {isOpen && !disabled && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-dark-2 border border-white/10 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                {options.length > 0 ? (
                  options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`
                        w-full px-4 py-3 text-sm text-left transition-colors
                        ${
                          value === option.value
                            ? "bg-primary-blue/20 text-white font-bold"
                            : "text-text-secondary hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-xs text-text-tertiary italic">
                    No options available
                  </div>
                )}
              </div>
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

Select.displayName = "Select";
export default Select;
