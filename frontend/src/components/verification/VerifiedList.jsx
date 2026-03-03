import React, { useState } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import StatsCard from "../common/StatsCard";
import VerifiedEntityCard from "./VerifiedEntityCard";
import { mockVerified } from "../../data/mockData";

const VerifiedList = () => {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVerified = mockVerified.filter((item) => {
    const matchesFilter = filter === "All" || item.type === filter;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats calculations
  const totalVerified = mockVerified.length;
  const verifiedClubs = mockVerified.filter((i) => i.type === "Club").length;
  const verifiedReps = mockVerified.filter(
    (i) => i.type === "Batch Rep",
  ).length;

  const handleRemoveVerification = (entity) => {
    console.log("Remove verification for:", entity.name);
    // Implement modal logic here later or pass up
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-xl w-full max-w-[1122px]">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-lg">
        <StatsCard
          iconSrc="/icon_verified_clubs.svg"
          iconAlt="Verified Clubs"
          iconBgClass="bg-blue-900/30"
          title="Verified Clubs"
          value={verifiedClubs}
          subValue="+3 new"
          subValueClass="text-state-success"
        />
        <StatsCard
          iconSrc="/icon_batch_rep.svg"
          iconAlt="Batch Reps"
          iconBgClass="bg-purple-900/30"
          title="Batch Reps"
          value={verifiedReps}
          subValue="+1 new"
          subValueClass="text-state-success"
        />
        <StatsCard
          iconSrc="/icon_verified_badge.svg"
          iconAlt="Total Verified"
          iconBgClass="bg-blue-500/5"
          title="Total Verified"
          value={totalVerified}
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
              All Verified
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

      {/* Verified List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg gap-y-6 content-start">
        {filteredVerified.map((entity) => (
          <div key={entity.id} className="h-72">
            <VerifiedEntityCard
              entity={entity}
              onRemoveVerification={handleRemoveVerification}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerifiedList;
