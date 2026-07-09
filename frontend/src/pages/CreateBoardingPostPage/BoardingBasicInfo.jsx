import { ImagePlus, MapPin, Edit3 } from "lucide-react";
import Card from "../../components/common/Card";
import LocationPicker from "../../components/boarding/LocationPicker";

const BoardingBasicInfo = ({
  title, setTitle,
  description, setDescription,
  location,
  latitude, longitude,
  roomType, setRoomType,
  gender, setGender,
  images,
  isDragging, setIsDragging,
  fileInputRef,
  onFiles, onRemoveImage,
  onLocationChange,
}) => (
  <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
        <Edit3 className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-lg font-bold">Basic Information</h3>
        <p className="text-text-secondary text-xs mt-0.5">Enter the core details of your boarding place</p>
      </div>
    </div>

    <div className="flex flex-col gap-6">
      {/* Photos */}
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Photos
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => onFiles(e.target.files)}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); onFiles(e.dataTransfer.files); }}
            className={`aspect-[4/3] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group ${isDragging ? "border-primary-blue bg-primary-blue/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary-blue/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200">
              <ImagePlus className="text-primary-blue w-5 h-5" />
            </div>
            <p className="text-white text-[11px] font-medium mb-1 text-center">
              Drag & drop or click
            </p>
            <p className="text-text-secondary text-[9px] text-center uppercase tracking-wider">
              Max. 10MB
            </p>
          </div>
          {images.map((img) => (
            <div key={img.id} className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-white/10">
              <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button onClick={() => onRemoveImage(img.id)} className="text-red-400 font-bold text-[10px] bg-red-400/20 px-2.5 py-1.5 rounded-lg border border-red-400/30 hover:bg-red-400/30 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Title / Boarding Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Modern Student Boarding near Campus"
          className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the boarding place, amenities, rules, and environment..."
          rows={6}
          className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors resize-y placeholder:text-text-secondary"
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Location <span className="text-red-500">*</span>
        </label>
        <LocationPicker onChange={onLocationChange} initialLat={latitude} initialLng={longitude} />
        {location && (
          <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-[#0F172A]/80 border border-white/10 rounded-xl">
            <MapPin className="w-4 h-4 text-primary-blue mt-0.5 flex-shrink-0" />
            <span className="text-sm text-white leading-snug">{location}</span>
          </div>
        )}
      </div>

      {/* Room Type & Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
            Room Type <span className="text-red-500">*</span>
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors appearance-none"
          >
            <option value="" disabled>Select Room Type</option>
            <option value="Single Private">Single Private</option>
            <option value="Shared Double">Shared Double</option>
            <option value="Shared Triple">Shared Triple</option>
            <option value="Dormitory">Dormitory</option>
            <option value="Entire Apartment">Entire Apartment</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
            Gender Preference
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors appearance-none"
          >
            <option value="Any">Any</option>
            <option value="Male Only">Male Only</option>
            <option value="Female Only">Female Only</option>
          </select>
        </div>
      </div>
    </div>
  </Card>
);

export default BoardingBasicInfo;
