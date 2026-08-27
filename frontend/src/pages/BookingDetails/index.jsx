import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useBookingDetails } from "./useBookingDetails";
import EventInfoCard from "./EventInfoCard";
import TicketDetailsCard from "./TicketDetailsCard";
import BookingTimeline from "./BookingTimeline";

const BookingDetails = () => {
  const { navigate, user, booking, loading, error, timeline, formatDate } = useBookingDetails();

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Booking Details" verificationCount={0}>
        <div className="flex flex-col items-center justify-center h-[50vh] text-text-tertiary">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Loading booking details...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !booking) {
    return (
      <MainLayout user={user} pageTitle="Booking Not Found" verificationCount={0}>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <h2 className="text-heading-medium text-text-primary mb-lg">{error || "Booking Not Found"}</h2>
          <Button onClick={() => navigate("/order-history")}>Back to History</Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout user={user} pageTitle="My History" verificationCount={0}>
      <div className="max-w-[1100px] mx-auto pb-2xl px-md">
        <button onClick={() => navigate("/order-history")}
          className="flex items-center gap-xs text-text-tertiary hover:text-text-primary transition-colors mb-lg group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-body-small-bold uppercase tracking-wider">Back to History</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          <div className="lg:col-span-2 space-y-xl">
            <EventInfoCard booking={booking} formatDate={formatDate} />
            <div className="grid grid-cols-1 gap-xl">
              <TicketDetailsCard booking={booking} />
            </div>
          </div>
          <div className="space-y-xl">
            <BookingTimeline timeline={timeline} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookingDetails;
