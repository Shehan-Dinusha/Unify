import React, { useState, useEffect } from "react";
import { Tag, Calendar, Edit3, X, Upload, Check, ChevronDown, Plus, Trash2, Search, Loader2, ImagePlus, Shirt, Watch, FileCode, Ticket } from "lucide-react";
import Card from "../common/Card";
import ClubPostCard from "../club/ClubPostCard";
import postService from "../../services/postService";

const CreateProductForm = ({ onCancel, onPublish }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Apparel",
        images: [],
        enableSizes: false,
        sizes: [],
        colors: [],
        deadline: "",
        pickupNote: ""
    });

    const [loading, setLoading] = useState(false);
    const [newColor, setNewColor] = useState({ hex: "#3B82F6", name: "" });
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef(null);
    const dropdownRef = React.useRef(null);
    const datePickerRef = React.useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [calendarDate, setCalendarDate] = useState(new Date());

    const categories = [
        { id: "Apparel", label: "Apparel", icon: Shirt, desc: "Clothing, hoodies & more" },
        { id: "Accessories", label: "Accessories", icon: Watch, desc: "Bags, caps & jewelry" },
        { id: "Digital", label: "Digital", icon: FileCode, desc: "E-books, designs & files" },
        { id: "Tickets", label: "Tickets", icon: Ticket, desc: "Events & raffles" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const startDay = (y, m) => new Date(y, m, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const handleFiles = (files) => {
        const newImages = Array.from(files)
            .filter(file => file.type.startsWith('image/'))
            .map(file => ({
                id: Date.now() + Math.random(),
                url: URL.createObjectURL(file),
                file
            }));
        if (newImages.length > 0) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newImages]
            }));
        }
    };

    const removeImage = (id) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(img => img.id !== id)
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const addColor = () => {
        if (newColor.name) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, { ...newColor, id: Date.now() }]
            }));
            setNewColor({ hex: "#3B82F6", name: "" });
        }
    };

    const removeColor = (id) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c.id !== id)
        }));
    };

    const handlePublish = async () => {
        if (!formData.name || !formData.description || !formData.price) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            const data = new FormData();
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("category", formData.category);
            data.append("enableSizes", formData.enableSizes);
            data.append("sizes", JSON.stringify(formData.sizes));
            data.append("colors", JSON.stringify(formData.colors));
            data.append("deadline", formData.deadline);
            data.append("pickupNote", formData.pickupNote);
            
            formData.images.forEach(img => {
                if (img.file) {
                    data.append("images", img.file);
                }
            });

            // Mock userId for now
            data.append("userId", 1);

            await postService.createPost("club-product", data);
            onPublish();
        } catch (error) {
            console.error("Failed to publish product:", error);
            alert(error.error || "Failed to publish product. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full text-white font-inter">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
                {/* Left Column: Form Sections */}
                <div className="flex flex-col gap-6 pb-8">
                    {/* Basic Information */}
                    <Card 
                        variant="card" 
                        overflow="overflow-visible" 
                        className="bg-[#1A2F45]/60 border-white/5 !p-4 sm:!p-6"
                        style={{ zIndex: isDropdownOpen ? 100 : 1 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                <Edit3 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Basic Information</h3>
                                <p className="text-text-secondary text-xs mt-0.5">Enter the core details of your product</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe your product..."
                                    rows={6}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors resize-y mb-2"
                                />
                                <div className="text-right text-[10px] text-text-secondary italic">
                                    Highlight key features, materials, and club relevance.
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Product Images
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        multiple 
                                        accept="image/*" 
                                        onChange={(e) => handleFiles(e.target.files)} 
                                    />
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
                                        className={`aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group ${isDragging ? 'border-primary-blue bg-primary-blue/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
                                            <ImagePlus className="text-blue-500 w-5 h-5" />
                                        </div>
                                        <p className="text-white text-[11px] font-medium mb-1 text-center">
                                            Drag & drop or click
                                        </p>
                                    </div>
                                    {formData.images.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                                            <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button onClick={() => removeImage(img.id)} className="p-2 bg-red-500/20 text-red-500 rounded-lg backdrop-blur-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                        Base Price (Rs.)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                        Category
                                    </label>
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className={`w-full bg-[#0F172A]/80 border ${isDropdownOpen ? 'border-primary-blue ring-1 ring-primary-blue/20' : 'border-white/10'} rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-200 group`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {(() => {
                                                    const current = categories.find(c => c.id === formData.category) || categories[0];
                                                    const Icon = current.icon;
                                                    return (
                                                        <>
                                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-primary-blue">
                                                                <Icon size={18} />
                                                            </div>
                                                            <span className="text-sm font-medium text-white">{current.label}</span>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-0 right-0 mt-2 z-[100] bg-[#161F32]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                                                <div className="p-2 flex flex-col gap-1">
                                                    {categories.map((cat) => {
                                                        const Icon = cat.icon;
                                                        const isSelected = formData.category === cat.id;
                                                        return (
                                                            <button
                                                                key={cat.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({ ...prev, category: cat.id }));
                                                                    setIsDropdownOpen(false);
                                                                }}
                                                                className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 text-left ${isSelected ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/20' : 'hover:bg-white/5 text-text-secondary hover:text-white border border-transparent'}`}
                                                            >
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-primary-blue text-white' : 'bg-white/5 text-text-tertiary'}`}>
                                                                    <Icon size={20} />
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="text-sm font-bold truncate">{cat.label}</span>
                                                                    <span className="text-[11px] opacity-60 truncate">{cat.desc}</span>
                                                                </div>
                                                                {isSelected && <Check size={16} className="ml-auto shrink-0" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Configuration */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-4 sm:!p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                    <Tag className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold">Configuration</h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-sm mb-1">Enable Sizes</div>
                                    <div className="text-xs text-text-secondary">Allow students to select different sizes</div>
                                </div>
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, enableSizes: !prev.enableSizes }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${formData.enableSizes ? 'bg-primary-blue' : 'bg-white/10'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.enableSizes ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            {formData.enableSizes && (
                                <div className="flex flex-wrap gap-2">
                                    {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${formData.sizes.includes(size)
                                                ? 'bg-primary-blue border-primary-blue text-white'
                                                : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                                                }`}
                                        >
                                            {size} {formData.sizes.includes(size) && <X className="inline w-3 h-3 ml-1" />}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-white/5">
                                <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4">
                                    Add color variants for this product
                                </div>
                                <div className="flex flex-wrap gap-3 mb-4">
                                    {formData.colors.map((color) => (
                                        <div key={color.id} className="flex items-center gap-2 bg-[#0F172A]/80 border border-white/10 rounded-full pl-1 pr-3 py-1 group">
                                            <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />
                                            <span className="text-xs font-medium">{color.name}</span>
                                            <button onClick={() => removeColor(color.id)} className="p-1 hover:text-red-400 transition-colors">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden border border-white/10 cursor-pointer relative">
                                        <input
                                            type="color"
                                            value={newColor.hex}
                                            onChange={(e) => setNewColor(prev => ({ ...prev, hex: e.target.value }))}
                                            className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] opacity-0 cursor-pointer"
                                        />
                                        <div className="w-full h-full" style={{ backgroundColor: newColor.hex }} />
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={newColor.name}
                                            onChange={(e) => setNewColor(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Color Name"
                                            className="w-full h-10 bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:border-primary-blue transition-colors"
                                        />
                                    </div>
                                    <button
                                        onClick={addColor}
                                        className="px-4 h-10 bg-primary-blue hover:bg-primary-blue/90 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                                        disabled={!newColor.name}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Deadline & Note */}
                    <Card variant="card" overflow="overflow-visible" className="bg-[#1A2F45]/60 border-white/5 !p-4 sm:!p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Order Deadline
                                </label>
                                <div className="relative" ref={datePickerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-sm hover:border-white/20 transition-all"
                                    >
                                        <span className={formData.deadline ? "text-white" : "text-text-tertiary"}>
                                            {formData.deadline ? new Date(formData.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "Select deadline date"}
                                        </span>
                                        <Calendar className="w-4 h-4 text-text-secondary" />
                                    </button>

                                    {isDatePickerOpen && (
                                        <div className="absolute bottom-full left-0 mb-2 z-[100] bg-[#161F32]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                                            <div className="flex items-center justify-between mb-4">
                                                <button 
                                                    type="button"
                                                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}
                                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                                </button>
                                                <div className="text-sm font-bold text-white">
                                                    {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}
                                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-7 gap-1 mb-2">
                                                {weekDays.map(d => (
                                                    <div key={d} className="text-[10px] font-bold text-text-tertiary text-center uppercase">{d}</div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-7 gap-1">
                                                {Array.from({ length: startDay(calendarDate.getFullYear(), calendarDate.getMonth()) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {Array.from({ length: daysInMonth(calendarDate.getFullYear(), calendarDate.getMonth()) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const dateStr = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                    const isSelected = formData.deadline === dateStr;
                                                    const isToday = new Date().toISOString().split('T')[0] === dateStr;

                                                    return (
                                                        <button
                                                            key={day}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, deadline: dateStr }));
                                                                setIsDatePickerOpen(false);
                                                            }}
                                                            className={`aspect-square rounded-lg text-xs flex items-center justify-center transition-all ${
                                                                isSelected 
                                                                    ? 'bg-primary-blue text-white font-bold' 
                                                                    : isToday 
                                                                        ? 'text-primary-blue bg-primary-blue/10 font-bold' 
                                                                        : 'text-text-secondary hover:bg-white/10 hover:text-white'
                                                            }`}
                                                        >
                                                            {day}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Pickup / Delivery Note
                                </label>
                                <textarea
                                    name="pickupNote"
                                    value={formData.pickupNote}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Free pickup from CS Lab on Fridays"
                                    rows={1}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors text-sm"
                                />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Preview Sidebar */}
                <div className="flex flex-col gap-6 xl:sticky xl:top-4 h-fit pb-24 xl:pb-0">
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                        Feed Preview
                    </div>
                    <div className="pointer-events-none">
                        <ClubPostCard 
                            post={{
                                id: "preview",
                                clubName: "Your Club Name",
                                clubSeed: "Your Club Name",
                                time: "Just now",
                                category: formData.category || "Apparel",
                                image: formData.images[0]?.url || "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22rgba(255,255,255,0.05)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214px%22%20fill%3D%22%2394A3B8%22%3ENo%20Image%20Provided%3C%2Ftext%3E%3C%2Fsvg%3E",
                                price: formData.price ? `Rs.${formData.price}` : "Rs.0.00",
                                text: formData.description || "No description provided.",
                                postType: "club-product",
                                stats: { likes: 0 },
                                comments: []
                            }} 
                            isOwner={false} 
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0B1724]/95 backdrop-blur-md border-t border-white/10 xl:static xl:z-auto xl:p-0 xl:bg-transparent xl:backdrop-blur-none xl:border-t-0 flex gap-4 mt-4 xl:mt-0">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handlePublish}
                            disabled={loading}
                            className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Publishing..." : "Publish Product"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateProductForm;
