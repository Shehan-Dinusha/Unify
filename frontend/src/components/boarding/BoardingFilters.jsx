import React, { useState } from "react";
import Card from "../common/Card";

/* ─── Boarding Filters Sidebar ───────────────────────────────── */
const BoardingFilters = ({ onFilterChange }) => {
    const [minPrice, setMinPrice] = useState(450);
    const [maxPrice, setMaxPrice] = useState(1200);
    const [gender, setGender] = useState("Any");

    const PRICE_MIN = 100;
    const PRICE_MAX = 2000;

    const genderOptions = ["Any", "Male Only", "Female Only"];

    const handleReset = () => {
        setMinPrice(450);
        setMaxPrice(1200);
        setGender("Any");
        onFilterChange?.({ minPrice: 450, maxPrice: 1200, gender: "Any" });
    };

    const handleGenderChange = (val) => {
        setGender(val);
        onFilterChange?.({ minPrice, maxPrice, gender: val });
    };

    const handleMinChange = (e) => {
        const val = Math.min(Number(e.target.value), maxPrice - 50);
        setMinPrice(val);
        onFilterChange?.({ minPrice: val, maxPrice, gender });
    };

    const handleMaxChange = (e) => {
        const val = Math.max(Number(e.target.value), minPrice + 50);
        setMaxPrice(val);
        onFilterChange?.({ minPrice, maxPrice: val, gender });
    };

    const toPercent = (val) => ((val - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-md">
                <h3 className="text-body-large-bold text-text-primary">Filters</h3>
                <button
                    onClick={handleReset}
                    className="text-[13px] text-primary hover:underline transition-all"
                >
                    Reset
                </button>
            </div>

            {/* Price Range */}
            <Card variant="card" padding="p-md" className="mb-md">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-body-small-bold text-text-primary">Price Range</span>
                    <span className="text-[11px] text-text-tertiary">$/month</span>
                </div>

                {/* Price labels */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-text-primary">${minPrice}</span>
                    <span className="text-[13px] font-semibold text-text-primary">${maxPrice}</span>
                </div>

                {/* Range track */}
                <div className="relative h-6 flex items-center">
                    {/* Background track */}
                    <div className="absolute w-full h-1.5 rounded-full bg-white/10" />
                    {/* Active range */}
                    <div
                        className="absolute h-1.5 rounded-full bg-primary"
                        style={{
                            left: `${toPercent(minPrice)}%`,
                            right: `${100 - toPercent(maxPrice)}%`,
                        }}
                    />
                    {/* Min thumb */}
                    <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        value={minPrice}
                        onChange={handleMinChange}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-10 dual-range-input "
                    />
                    {/* Max thumb */}
                    <input
                        type="range"
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        value={maxPrice}
                        onChange={handleMaxChange}
                        className="absolute w-full h-full opacity-0 cursor-pointer z-20 dual-range-input"
                    />
                    {/* Thumb dots */}
                    <div
                        className="absolute w-4 h-4 rounded-full bg-[#2B8CEE] border-1 border-white shadow-md pointer-events-none"
                        style={{ left: `calc(${toPercent(minPrice)}% - 8px)` }}
                    />
                    <div
                        className="absolute w-4 h-4 rounded-full bg-[#2B8CEE] border-1 border-white shadow-md pointer-events-none"
                        style={{ left: `calc(${toPercent(maxPrice)}% - 8px)` }}
                    />
                </div>
            </Card>

            {/* Gender Preference */}
            <Card variant="card" padding="p-md">
                <p className="text-body-small-bold text-text-primary mb-3">Gender Preference</p>
                <div className="flex flex-col gap-2">
                    {genderOptions.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleGenderChange(opt)}
                            className={`flex items-center justify-between w-full px-4 py-3 bg-[#18232F] rounded-xl border transition-all
                                ${gender === opt
                                    ? "border-primary/50 bg-primary/10"
                                    : "border-white/10 bg-white/5 hover:bg-white/8"
                                }`}
                        >
                            <span className="text-[13px] font-medium text-text-primary">{opt}</span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                                ${gender === opt ? "border-primary" : "border-white/30"}`}>
                                {gender === opt && (
                                    <div className="w-2 h-2 rounded-full bg-[#2B8CEE]" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default BoardingFilters;
