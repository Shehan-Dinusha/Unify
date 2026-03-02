import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = React.forwardRef(({ label, error, options = [], className = '', value, onChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (options[0]?.label || '');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optValue) => {
    // Mimic native onChange event shape
    if (onChange) {
      onChange({ target: { value: optValue } });
    }
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger button */}
        <button
          type="button"
          ref={ref}
          className={`
            w-full h-12 appearance-none rounded-2xl bg-white/5 border outline-none transition-all
            font-inter text-sm text-text-primary px-4 text-left
            shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
            ${error ? 'border-state-error/50' : 'border-white/10 focus:border-primary-blue/50'}
          `}
          onClick={() => setIsOpen(!isOpen)}
          {...props}
        >
          {displayLabel}
        </button>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
          <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* Custom dropdown panel */}
        {isOpen && (
          <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl bg-dark-2 border border-white/10 shadow-xl overflow-hidden max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`w-full px-4 py-3 text-left text-sm font-inter transition-colors
                  ${opt.value === value
                    ? 'bg-primary-blue/20 text-primary-blue font-semibold'
                    : 'text-text-primary hover:bg-white/10'
                  }`}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <span className="text-state-error text-xs font-normal font-inter leading-5">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;