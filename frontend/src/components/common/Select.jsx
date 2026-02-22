import React from 'react';
import { ChevronDown } from 'lucide-react'; // Example icon library

const Select = React.forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full h-12 appearance-none rounded-2xl bg-white/5 border outline-none transition-all
            font-inter text-sm text-text-primary px-4
            shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
            ${error ? 'border-state-error/50' : 'border-white/10 focus:border-primary-blue/50'}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark-2 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
          <ChevronDown size={18} />
        </div>
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