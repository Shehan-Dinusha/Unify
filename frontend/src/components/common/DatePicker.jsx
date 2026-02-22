import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

/**
 * Custom DatePicker component for Unify Design System.
 * Refined to match Select.jsx aesthetics with a dark-2 theme and rounded-2xl panel.
 */
const DatePicker = ({
  label,
  error,
  value,
  onChange,
  placeholder = "Select Date",
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef(null);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Close on outside click
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onChange({
      target: {
        name: props.name,
        value: selectedDate.toISOString(),
      },
    });
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const calendarDays = [];

    // Previous month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      calendarDays.push(
        <div
          key={`prev-${i}`}
          className="text-text-tertiary/30 p-2 text-center text-xs"
        >
          {prevMonthDays - i}
        </div>,
      );
    }

    // Current month days
    const selectedDate = value ? new Date(value) : null;
    for (let i = 1; i <= daysInMonth; i++) {
      const isSelected =
        selectedDate &&
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;

      calendarDays.push(
        <button
          key={i}
          type="button"
          onClick={() => handleDateSelect(i)}
          className={`p-2 text-center text-xs rounded-lg transition-colors
            ${
              isSelected
                ? "bg-primary-blue text-white font-bold"
                : "text-text-secondary hover:bg-white/10 hover:text-white"
            }
          `}
        >
          {i}
        </button>,
      );
    }

    return calendarDays;
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
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${isOpen ? "text-primary-blue" : "text-text-secondary"}`}
        >
          <CalendarIcon size={20} />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full h-12 flex items-center justify-between rounded-2xl bg-white/5 border outline-none transition-all
            font-inter text-sm text-left pl-12 pr-4
            shadow-[inset_0px_2px_4px_1px_rgba(0,0,0,0.05)]
            ${error ? "border-state-error/50" : isOpen ? "border-primary-blue/50 bg-white/10" : "border-white/10 group-hover:border-white/20"}
            ${value ? "text-text-primary" : "text-text-tertiary"}
          `}
        >
          <span>{value ? formatDate(value) : placeholder}</span>
        </button>

        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 w-[280px] z-50 bg-dark-2 border border-white/10 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 hover:bg-white/10 rounded-lg text-text-tertiary hover:text-white"
              >
                <ChevronLeft size={18} />
              </button>
              <h4 className="text-white text-sm font-bold">
                {months[currentMonth]} {currentYear}
              </h4>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 hover:bg-white/10 rounded-lg text-text-tertiary hover:text-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {days.map((day) => (
                <div
                  key={day}
                  className="text-text-tertiary text-[10px] font-bold uppercase text-center py-1"
                >
                  {day}
                </div>
              ))}
              {renderCalendar()}
            </div>
          </div>
        )}
      </div>

      {error && (
        <span className="text-state-error text-xs font-normal font-inter leading-5 mt-1">
          {error}
        </span>
      )}
    </div>
  );
};

export default DatePicker;
