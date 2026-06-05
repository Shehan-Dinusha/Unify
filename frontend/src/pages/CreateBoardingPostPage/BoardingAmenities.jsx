import { Wifi, Plus, X, Tag as TagIcon } from "lucide-react";
import Card from "../../components/common/Card";

const BoardingAmenities = ({
  amenityInput, setAmenityInput,
  amenities,
  onAddAmenity, onRemoveAmenity,
}) => (
  <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
        <TagIcon className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold">Amenities</h3>
    </div>
    <div className="flex flex-col gap-6">
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Other Amenities
        </label>
        <div className="relative mb-3">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            <Wifi className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={amenityInput}
            onChange={(e) => setAmenityInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAddAmenity()}
            placeholder="e.g. Free Wi-Fi, Air Conditioning, Washing Machine, Parking..."
            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {amenities.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-text-secondary">
              {item}
              <button onClick={() => onRemoveAmenity(item)} className="hover:text-white transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={onAddAmenity}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-blue/10 border border-primary-blue/20 text-primary-blue rounded-full text-xs hover:bg-primary-blue/20 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add tag
          </button>
        </div>
      </div>
    </div>
  </Card>
);

export default BoardingAmenities;
