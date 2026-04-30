import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Button from "../common/Button";
import StatsCard from "../common/StatsCard";
import Avatar from "../common/Avatar";

const RequestList = ({ requests, stats, onVerify, onReject, loading }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = (Array.isArray(requests) ? requests : []).filter(
    (req) => {
      const matchesFilter = filter === "All" || req.type === filter;
      const matchesSearch = req.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    },
  );

  const handleView = (req) => {
    if (req.type === "Club") {
      navigate("/club-verification");
    } else if (req.type === "Batch Rep") {
      navigate("/batch-rep-verification");
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-xl w-full max-w-[1122px]">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-lg">
        <StatsCard
          iconSrc="/icon_total_pending.svg"
          iconAlt="Pending"
          iconBgClass="bg-yellow-900/30"
          title="Total Pending"
          value={
            stats?.totalPending ||
            (Array.isArray(requests) ? requests.length : 0)
          }
          subValue={`+${stats?.newPending || 0} new`}
          subValueClass="text-state-success"
          loading={loading}
        />
        <StatsCard
          iconSrc="/icon_approved_today.svg"
          iconAlt="Approved"
          iconBgClass="bg-green-900/30"
          title="Approved Today"
          value={stats?.approvedToday || 0}
          loading={loading}
        />
        <StatsCard
          iconSrc="/icon_rejected_today.svg"
          iconAlt="Rejected"
          iconBgClass="bg-red-900/30"
          title="Rejected Today"
          value={stats?.rejectedToday || 0}
          loading={loading}
        />
      </div>

      {/* Filter Bar */}
      <Card variant="container" className="">
        <div className="flex flex-col md:flex-row justify-between items-center gap-md">
          {/* Search */}
          <div className="relative w-full md:w-96 pl-2 md:pl-0">
            <img
              src="/icon_search.svg"
              alt="Search"
              className="absolute left-6 md:left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] opacity-50"
            />
            <input
              type="text"
              placeholder="Search by name, ID or entity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-md bg-dark-4 border border-white/10 rounded-lg text-body-small text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-blue transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-sm w-full md:w-auto overflow-x-auto scrollbar-hide pb-xs md:pb-0 px-2 md:px-0 scroll-smooth">
            <Button
              size="small"
              variant={filter === "All" ? "primary" : "secondary"}
              className={`h-8 sm:h-9 text-xs px-3 sm:px-4 whitespace-nowrap ${filter !== "All" ? "bg-dark-4 text-text-secondary border border-white/10" : ""}`}
              onClick={() => setFilter("All")}
            >
              All Requests
            </Button>
            <Button
              size="small"
              variant={filter === "Club" ? "primary" : "secondary"}
              className={`h-8 sm:h-9 text-xs px-3 sm:px-4 whitespace-nowrap ${filter !== "Club" ? "bg-dark-4 text-text-secondary border border-white/10" : ""}`}
              onClick={() => setFilter("Club")}
            >
              Clubs
            </Button>
            <Button
              size="small"
              variant={filter === "Batch Rep" ? "primary" : "secondary"}
              className={`h-8 sm:h-9 text-xs px-3 sm:px-4 whitespace-nowrap ${filter !== "Batch Rep" ? "bg-dark-4 text-text-secondary border border-white/10" : ""}`}
              onClick={() => setFilter("Batch Rep")}
            >
              Batch Reps
            </Button>
          </div>
        </div>
      </Card>

      {/* Request List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {filteredRequests.map((req) => (
          <Card
            key={req.id}
            variant="container"
            className="h-full hover:bg-white/5 transition-colors cursor-pointer group"
            onClick={() => handleView(req)}
          >
            <div className="flex flex-col gap-lg h-full">
              {/* Header Section */}
              <div className="flex justify-between items-start">
                <div className="flex gap-sm">
                  <Avatar
                    src={req.avatar}
                    name={req.name}
                    className="w-12 h-12 rounded-full border border-white/10"
                  />
                  <div>
                    <h3 className="text-body-medium-bold text-text-primary px-1">
                      {req.name}
                    </h3>
                    <div className="flex items-center flex-wrap gap-1 md:gap-sm mt-1">
                      <span
                        className={`px-sm py-xs rounded text-body-extra-small-bold font-inter ${
                          req.type === "Club"
                            ? "bg-indigo-900/30 text-indigo-300"
                            : "bg-purple-900/30 text-purple-300"
                        }`}
                      >
                        {req.type}
                      </span>
                      <span className="text-text-secondary text-body-extra-small font-normal">
                        • {req.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-xs bg-yellow-900/20 rounded flex items-center justify-center">
                  <img
                    src="/icon_pending.svg"
                    alt="Pending Status"
                    className="w-3 h-3 text-yellow-500"
                  />
                </div>
              </div>

              {/* File Preview */}
              <div className="p-sm bg-dark-4 rounded-lg border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-sm overflow-hidden">
                  <div
                    className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${
                      req.fileType === "pdf"
                        ? "bg-red-900/20"
                        : req.fileType === "doc"
                          ? "bg-blue-900/20"
                          : "bg-orange-900/20"
                    }`}
                  >
                    {req.fileType === "pdf" && (
                      <img src="/icon_file_pdf.svg" className="w-5 h-5" />
                    )}
                    {req.fileType === "doc" && (
                      <img src="/icon_docs.svg" className="w-5 h-5" />
                    )}
                    {req.fileType === "image" && (
                      <img src="/icon_image.svg" className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-primary text-body-small font-medium truncate">
                      {req.file}
                    </p>
                    <p className="text-text-secondary text-body-extra-small">
                      {req.fileSize}
                    </p>
                  </div>
                </div>
                <button
                  className="flex-shrink-0 text-text-secondary hover:text-primary-blue transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleView(req);
                  }}
                >
                  <img
                    src="/icon_view.svg"
                    alt="View"
                    className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-sm mt-auto">
                <Button
                  variant="dangerOutline"
                  className="h-[42px] border-state-error/30 text-state-error hover:bg-state-error/10 hover:border-state-error/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject(req);
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  className="h-[42px] shadow-none bg-primary-blue hover:bg-primary-blue/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerify(req);
                  }}
                >
                  Verify
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RequestList;
