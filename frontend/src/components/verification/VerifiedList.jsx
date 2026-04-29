import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import StatsCard from "../common/StatsCard";
import VerifiedEntityCard from "./VerifiedEntityCard";
import verificationService from "../../services/verificationService";
import { useToast } from "../common/Toast";

const VerifiedList = () => {
  const toast = useToast();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedEntities, setVerifiedEntities] = useState([]);
  const [stats, setStats] = useState({
    totalVerified: 0,
    totalClubs: 0,
    totalBatchReps: 0,
    newVerifiedClubs: 0,
    newVerifiedReps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerified();
  }, []);

  const fetchVerified = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getVerifiedEntities();
      if (response.success) {
        setVerifiedEntities(response.data.entities);
        setStats(response.data.stats);
      }
    } catch (error) {
      toast.error("Failed to fetch verified entities");
    } finally {
      setLoading(false);
    }
  };

  const filteredVerified = (
    Array.isArray(verifiedEntities) ? verifiedEntities : []
  ).filter((item) => {
    const matchesFilter = filter === "All" || item.type === filter;
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRemoveVerification = async (entity) => {
    try {
      const response = await verificationService.removeVerifiedAccount(
        entity.id,
      );
      if (response.success) {
        toast.success("Success", `Removed verification for ${entity.name}`);
        setVerifiedEntities((prev) =>
          Array.isArray(prev) ? prev.filter((e) => e.id !== entity.id) : [],
        );
      }
    } catch (error) {
      toast.error("Error", "Failed to remove verification");
    }
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
          value={stats?.totalClubs || 0}
          subValue={`+${stats?.newVerifiedClubs || 0} new`}
          subValueClass="text-state-success"
          loading={loading}
        />
        <StatsCard
          iconSrc="/icon_batch_rep.svg"
          iconAlt="Batch Reps"
          iconBgClass="bg-purple-900/30"
          title="Batch Reps"
          value={stats?.totalBatchReps || 0}
          subValue={`+${stats?.newVerifiedReps || 0} new`}
          subValueClass="text-state-success"
          loading={loading}
        />
        <StatsCard
          iconSrc="/icon_verified_badge.svg"
          iconAlt="Total Verified"
          iconBgClass="bg-blue-500/5"
          title="Total Verified"
          value={stats?.totalVerified || 0}
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
