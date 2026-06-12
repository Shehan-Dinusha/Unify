import { Users, Phone, BedDouble, Calendar } from "lucide-react";
import Card from "../../components/common/Card";

const BoardingPricing = ({
  price, setPrice,
  capacity, setCapacity,
  phone, setPhone,
  slots, setSlots,
}) => (
  <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 bg-green-500/20 text-green-500 rounded-lg">
        <Calendar className="w-5 h-5" />
      </div>
      <h3 className="text-lg font-bold">Pricing & Availability</h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Price (Monthly) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            <span className="text-sm font-bold">Rs.</span>
          </div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Total Capacity <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            <Users className="w-4 h-4" />
          </div>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Total people"
            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
          />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07X XXX XXXX"
            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
          Available Slots <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">
            <BedDouble className="w-4 h-4" />
          </div>
          <input
            type="number"
            value={slots}
            onChange={(e) => setSlots(e.target.value)}
            placeholder="e.g. 1"
            className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors placeholder:text-text-secondary"
          />
        </div>
      </div>
    </div>
  </Card>
);

export default BoardingPricing;
