import React, { useState } from "react";
import { Tag, Calendar, Edit3, X, Upload, Check, ChevronDown, Plus, Trash2, Search } from "lucide-react";
import Card from "../common/Card";
import { mockClubProduct } from "../../data/mockClubProduct";

const CreateProductForm = ({ onCancel, onPublish }) => {
    const [formData, setFormData] = useState({
        name: "Hackathon 2024 Hoodie",
        description: "Level up your coding sessions with the official Hackathon 2024 hoodie. Featuring a premium heavyweight cotton blend.",
        price: "35.00",
        category: "Apparel",
        images: [
            { id: 1, url: mockClubProduct.images[0].src }
        ],
        enableSizes: true,
        sizes: ["XS", "S", "M", "L"],
        colors: [
            { id: 1, hex: "#0B1220", name: "Midnight Black" },
            { id: 2, hex: "#2B2F36", name: "Charcoal" }
        ],
        deadline: "",
        pickupNote: "Free pickup from CS Lab on Fridays"
    });

    const [newColor, setNewColor] = useState({ hex: "#3B82F6", name: "" });

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

    return (
        <div className="flex flex-col w-full h-full text-white font-inter">
            {/* Header 
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Create New Product</h2>
                <div className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-text-secondary">
                    <Search className="w-5 h-5" />
                </div>
            </div>*/}

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8">
                {/* Left Column: Form Sections */}
                <div className="flex flex-col gap-6 pb-8">
                    {/* Basic Information */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                                <Edit3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold">Basic Information</h3>
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
                                    rows={4}
                                    className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors resize-none mb-2"
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
                                    <div className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-secondary group-hover:text-white transition-colors">
                                            <Upload className="w-5 h-5" />
                                        </div>
                                        <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest text-center px-4">
                                            Click to upload
                                        </div>
                                    </div>
                                    {formData.images.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                                            <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button className="p-2 bg-red-500/20 text-red-500 rounded-lg backdrop-blur-md">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                        Base Price ($)
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                        Category
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors appearance-none"
                                        >
                                            <option>Apparel</option>
                                            <option>Accessories</option>
                                            <option>Digital</option>
                                            <option>Tickets</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Configuration */}
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
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
                                    <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-dashed border-white/20 text-text-secondary hover:bg-white/10 transition-all">
                                        + Add Size
                                    </button>
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
                                    <button className="w-8 h-8 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-text-secondary hover:bg-white/10 transition-all">
                                        <Plus className="w-4 h-4" />
                                    </button>
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
                    <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                                    Order Deadline
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-blue transition-colors text-sm appearance-none"
                                    />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
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
                <div className="flex flex-col gap-6 sticky top-4 h-fit">
                    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
                        Product Preview
                    </div>
                    <Card variant="card" className="bg-[#0B1724]/60 border-white/10 !p-0 overflow-hidden shadow-2xl">
                        {/* Preview Image */}
                        <div className="aspect-[4/3] bg-white/5 relative group">
                            {formData.images[0] ? (
                                <img
                                    src={formData.images[0].url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-secondary">
                                    No Image Provided
                                </div>
                            )}
                        </div>

                        {/* Preview Content */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold leading-tight">{formData.name || "Product Name"}</h3>
                                <div className="text-primary-blue font-bold text-lg">Rs.{formData.price || "0.00"}</div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs font-medium text-text-secondary">{formData.category}</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full" />
                                <span className="text-xs font-medium text-text-secondary">By CS Society</span>
                            </div>

                            <p className="text-xs text-text-secondary leading-relaxed mb-6 line-clamp-3">
                                {formData.description || "No description provided."}
                            </p>

                            {/* Color Selection */}
                            <div className="mb-6">
                                <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Color</div>
                                <div className="flex gap-2">
                                    {formData.colors.map((color, idx) => (
                                        <div
                                            key={color.id}
                                            className={`w-5 h-5 rounded-full border border-white/20 cursor-pointer ${idx === 0 ? 'ring-2 ring-primary-blue ring-offset-2 ring-offset-[#0B1724]' : ''}`}
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            {formData.enableSizes && (
                                <div className="mb-8">
                                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">Size</div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.sizes.map((size, idx) => (
                                            <div
                                                key={size}
                                                className={`px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-bold ${idx === 1 ? 'bg-primary-blue border-primary-blue text-white' : 'text-text-secondary'}`}
                                            >
                                                {size}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button className="w-full py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_4px_15px_rgba(59,130,246,0.3)] mb-4">
                                Buy Now
                            </button>

                            <div className="text-[10px] text-text-secondary text-center italic">
                                {formData.pickupNote}
                            </div>
                        </div>
                    </Card>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onPublish}
                            className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                        >
                            Publish Now
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
            `}</style>
        </div>
    );
};

export default CreateProductForm;
