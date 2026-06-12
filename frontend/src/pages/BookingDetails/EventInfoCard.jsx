import React from "react";
import Card from "../../components/common/Card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { getImageUrl } from "../../utils/formatters";

const EventInfoCard = ({ booking, formatDate }) => (
  <Card variant="container" padding="p-lg" className="border-white/10 overflow-hidden">
    <div className="flex flex-col md:flex-row gap-xl">
      <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
        <img src={getImageUrl(booking.event?.coverImage)} alt={booking.event?.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-start gap-md mb-2">
          <div>
            <h1 className="text-heading-medium text-text-primary mb-1 leading-tight">{booking.event?.name || "Event Booking"}</h1>
            <p className="text-body-small text-text-tertiary">
              Hosted by <span className="text-primary-blue font-medium">{booking.event?.author?.name || "Club"}</span>
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-heading-small text-text-primary">Rs.{parseFloat(booking.total).toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-lg">
          <div className="flex items-center gap-3 text-text-secondary">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-blue">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Date</p>
              <p className="text-body-small-bold text-text-primary">{formatDate(booking.event?.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-blue">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Time</p>
              <p className="text-body-small-bold text-text-primary">{booking.event?.time || "TBA"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-text-secondary sm:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-blue">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-text-tertiary">Location</p>
              <p className="text-body-small-bold text-text-primary">{booking.event?.location || "TBA"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
);

export default EventInfoCard;
