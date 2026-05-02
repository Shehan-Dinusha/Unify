import React, { useState, useEffect } from "react";
import Card from "../common/Card";
import Button from "../common/Button";
import StatsCard from "../common/StatsCard";
import VerifiedEntityCard from "./VerifiedEntityCard";
import verificationService from "../../services/verificationService";
import {
  VerificationRejectionModal,
  VerificationRejectedSuccessModal,
  ActionErrorModal,
} from "../common/VerificationModals";
import DocumentPreviewModal from "../common/DocumentPreviewModal";

const VerifiedList = () => {
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

  // States for Removal Modal
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [showRemovalSuccessModal, setShowRemovalSuccessModal] = useState(false);
  const [entityToRemove, setEntityToRemove] = useState(null);
  const [removalReason, setRemovalReason] = useState("");

  // Error State
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Document Preview State
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    fetchVerified();
  }, []);

  const fetchVerified = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getVerifiedEntities();
      if (response.success) {
        setVerifiedEntities(response.data?.verified || []);
        setStats(
          response.data?.stats || {
            totalVerified: 0,
            totalClubs: 0,
            totalBatchReps: 0,
            newVerifiedClubs: 0,
            newVerifiedReps: 0,
          },
        );
      }
    } catch (error) {
      setErrorMessage("Failed to fetch verified entities.");
      setShowErrorModal(true);
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

  const handleRemoveClick = (entity) => {
    setEntityToRemove(entity);
    setShowRemovalModal(true);
  };

  const handleViewDocument = (entity) => {
    setPreviewDoc({
      name: entity.documentName || "Document",
      url: entity.documentUrl,
    });
  };

  const handleConfirmRemoval = async (reason, customReason) => {
    const finalReason = customReason || reason;
    setVerifiedEntities((prev) =>
      Array.isArray(prev)
        ? prev.filter((e) => e.id !== entityToRemove.id)
        : [],
    );
    setStats((prev) => {
      if (!prev) return prev;
      const isClub = entityToRemove.type === "Club";
      return {
        ...prev,
        totalVerified: Math.max(0, (prev.totalVerified || 0) - 1),
        totalClubs: isClub
          ? Math.max(0, (prev.totalClubs || 0) - 1)
          : prev.totalClubs,
        totalBatchReps: !isClub
          ? Math.max(0, (prev.totalBatchReps || 0) - 1)
          : prev.totalBatchReps,
      };
    });
    try {
      const response = await verificationService.removeVerifiedAccount(
        entityToRemove.id,
        finalReason,
      );
      if (response.success) {
        setRemovalReason(finalReason);
        setShowRemovalModal(false);
        setShowRemovalSuccessModal(true);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to remove verification. Please try again.",
      );
      setShowErrorModal(true);
      fetchVerified();
    }
  };

  const handleCloseError = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleCloseRemovalSuccess = () => {
    setShowRemovalSuccessModal(false);
    setEntityToRemove(null);
    setRemovalReason("");
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
          subValue={stats?.newVerifiedClubs > 0 ? `+${stats.newVerifiedClubs} new` : undefined}
          subValueClass="text-state-success"
          loading={loading}
        />
        <StatsCard
          iconSrc="/icon_batch_rep.svg"
          iconAlt="Batch Reps"
          iconBgClass="bg-purple-900/30"
          title="Batch Reps"
          value={stats?.totalBatchReps || 0}
          subValue={stats?.newVerifiedReps > 0 ? `+${stats.newVerifiedReps} new` : undefined}
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
              onRemoveVerification={handleRemoveClick}
              onViewDocument={handleViewDocument}
            />
          </div>
        ))}
      </div>

      {/* Removal Modals */}
      <VerificationRejectionModal
        isOpen={showRemovalModal}
        onClose={() => setShowRemovalModal(false)}
        onConfirm={handleConfirmRemoval}
        clubName={entityToRemove?.name}
        requestType={entityToRemove?.type}
        loading={loading}
      />
      <VerificationRejectedSuccessModal
        isOpen={showRemovalSuccessModal}
        onClose={handleCloseRemovalSuccess}
        clubName={entityToRemove?.name}
        reason={removalReason}
      />

      <ActionErrorModal
        isOpen={showErrorModal}
        onClose={handleCloseError}
        title="Action Failed"
        message={errorMessage}
      />

      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
      />
    </div>
  );
};

export default VerifiedList;
