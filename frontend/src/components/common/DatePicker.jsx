import React, { useState, useRef, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  maxDate,
  placeholder = "Select Date",
  className = "",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("calendar"); // calendar, month, year
  const containerRef = useRef(null);

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const fullMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setViewMode("calendar");
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

  // Generate year range for picker
  const startYear = 1940;
  const endYear = new Date().getFullYear() + 20;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).reverse();

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

  const handleMonthSelect = (monthIndex) => {
    setViewDate(new Date(currentYear, monthIndex, 1));
    setViewMode("calendar");
  };

  const handleYearSelect = (year) => {
    setViewDate(new Date(year, currentMonth, 1));
    setViewMode("calendar");
  };

  const yearListRef = useRef(null);

  useEffect(() => {
    if (viewMode === "year" && yearListRef.current) {
      const activeYearBtn = yearListRef.current.querySelector("[data-active='true']");
      if (activeYearBtn) {
        activeYearBtn.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [viewMode]);

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
          className="text-text-tertiary/20 p-2 text-center text-xs"
        >
          {prevMonthDays - i}
        </div>,
      );
    }

    // Current month days
    const selectedDateValue = value ? new Date(value) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const max = maxDate ? new Date(maxDate) : null;
    if (max) max.setHours(0, 0, 0, 0);

    for (let i = 1; i <= daysInMonth; i++) {
      const dateAtDay = new Date(currentYear, currentMonth, i);
      const isSelected =
        selectedDateValue &&
        selectedDateValue.getDate() === i &&
        selectedDateValue.getMonth() === currentMonth &&
        selectedDateValue.getFullYear() === currentYear;

      const isDisabled = max && dateAtDay > max;

      calendarDays.push(
        <button
          key={i}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateSelect(i)}
          className={`p-2 text-center text-xs rounded-lg transition-colors
            ${
              isSelected
                ? "bg-primary-blue text-white font-bold"
                : isDisabled
                  ? "text-text-tertiary/10 cursor-not-allowed"
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

  const renderMonthPicker = () => (
    <div className="grid grid-cols-3 gap-2 py-2">
      {fullMonths.map((month, index) => (
        <button
          key={month}
          type="button"
          onClick={() => handleMonthSelect(index)}
          className={`py-3 text-sm rounded-xl transition-all ${
            index === currentMonth
              ? "bg-primary-blue text-white font-bold"
              : "text-text-secondary hover:bg-white/10 hover:text-white"
          }`}
        >
          {months[index]}
        </button>
      ))}
    </div>
  );

  const renderYearPicker = () => {
    return (
      <div ref={yearListRef} className="grid grid-cols-4 gap-2 py-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
        {years.map((year) => (
          <button
            key={year}
            type="button"
            data-active={year === currentYear}
            onClick={() => handleYearSelect(year)}
            className={`py-2 text-xs rounded-lg transition-all ${
              year === currentYear
                ? "bg-primary-blue text-white font-bold"
                : "text-text-secondary hover:bg-white/10 hover:text-white"
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    );
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
          <div className="absolute top-[calc(100%+8px)] left-0 w-[300px] z-50 bg-dark-2 border border-white/10 rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              {viewMode === "calendar" ? (
                <>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-text-tertiary hover:text-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/5">
                    <button 
                      type="button"
                      onClick={() => setViewMode("month")}
                      className="text-white text-xs font-bold hover:bg-white/10 px-2 py-1 rounded-md transition-all flex items-center gap-1 group/btn"
                    >
                      {fullMonths[currentMonth]}
                      <ChevronDown size={12} className="text-text-tertiary group-hover/btn:text-white transition-colors" />
                    </button>
                    <div className="w-[1px] h-3 bg-white/10" />
                    <button 
                      type="button"
                      onClick={() => setViewMode("year")}
                      className="text-white text-xs font-bold hover:bg-white/10 px-2 py-1 rounded-md transition-all flex items-center gap-1 group/btn"
                    >
                      {currentYear}
                      <ChevronDown size={12} className="text-text-tertiary group-hover/btn:text-white transition-colors" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-text-tertiary hover:text-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              ) : (
                <>
                  <h4 className="text-white text-sm font-bold px-2">
                    Select {viewMode === "month" ? "Month" : "Year"}
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setViewMode("calendar")}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-text-tertiary hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Content Area */}
            {viewMode === "calendar" && (
              <div className="grid grid-cols-7 gap-1">
                {days.map((day) => (
                  <div
                    key={day}
                    className="text-text-tertiary text-[10px] font-bold uppercase text-center py-1 mb-1"
                  >
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            )}

            {viewMode === "month" && renderMonthPicker()}
            {viewMode === "year" && renderYearPicker()}
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
