import { ImagePlus, MapPin } from "lucide-react";
import Card from "../../components/common/Card";

const BoardingPreview = ({ images, price, title, location, description, amenities, user }) => (
  <>
    <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">
      Post Preview
    </div>

    <Card variant="card" className="bg-[#0B1724]/60 border-white/10 !p-0 overflow-hidden shadow-2xl">
      <div className="aspect-[4/3] bg-white/5 relative group bg-dark-1/50 flex items-center justify-center">
        {images.length > 0 ? (
          <>
            <img src={images[0].url} alt="Preview" className="w-full h-full object-cover" />
            {images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white border border-white/10 shadow-lg">
                +{images.length - 1} more
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/20">
            <ImagePlus className="w-10 h-10 mb-2" />
            <span className="text-[11px] font-bold uppercase tracking-wider">No photos added</span>
          </div>
        )}
        {price && (
          <div className="absolute bottom-4 left-4 bg-dark-1/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 z-10">
            <span className="text-[13px] font-bold text-white">Rs.{price}/month</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt="User"
              className="w-9 h-9 rounded-full border border-white/20"
            />
            <div>
              <p className="text-[13px] font-bold text-white">{user.displayRole}</p>
              <p className="text-[11px] text-text-tertiary">Just now</p>
            </div>
          </div>
        </div>

        <h2 className="text-heading-small md:text-[18px] font-bold text-white mb-2 leading-tight">
          {title || "Boarding Title Will Appear Here"}
        </h2>

        <div className="flex items-center gap-1 mb-3">
          <MapPin size={13} className="text-text-tertiary flex-shrink-0" />
          <span className="text-[13px] text-text-tertiary line-clamp-1">
            {location || "Your location will appear here"}
          </span>
        </div>

        <p className="text-[14px] text-text-secondary leading-6 mb-4 line-clamp-2 min-h-[48px] whitespace-pre-wrap">
          {description || "Your post description will appear here..."}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/10">
          {amenities.length > 0 ? amenities.slice(0, 3).map((item, idx) => (
            <span key={idx} className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-tertiary">
              {item}
            </span>
          )) : (
            <span className="text-[11px] text-text-tertiary italic">No amenities specified</span>
          )}
          {amenities.length > 3 && (
            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-text-tertiary">
              +{amenities.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Card>
  </>
);

export default BoardingPreview;
