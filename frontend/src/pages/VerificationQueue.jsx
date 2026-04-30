import React, { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import VerifiedList from "../components/verification/VerifiedList";
import RequestList from "../components/verification/RequestList";
import verificationService from "../services/verificationService";
import { useToast } from "../components/common/Toast";
import {
  VerificationConfirmationModal,
  VerificationSuccessModal,
  VerificationRejectionModal,
  VerificationRejectedSuccessModal,
} from "../components/common/VerificationModals";

const VerificationQueue = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [requestStats, setRequestStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verifiedRequest, setVerifiedRequest] = useState(null);

  // Rejection State
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showRejectionSuccessModal, setShowRejectionSuccessModal] =
    useState(false);
  const [rejectedRequest, setRejectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await verificationService.getPendingRequests();
      if (response.success) {
        setRequests(response.data?.requests || []);
        setRequestStats(response.data?.stats || null);
      }
    } catch (error) {
      toast.error("Error", "Failed to fetch pending requests");
      setRequests([]);
      setRequestStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (request) => {
    setSelectedRequest(request);
  };

  const handleConfirmVerify = async () => {
    try {
      const response = await verificationService.approveRequest(
        selectedRequest.id,
      );
      if (response.success) {
        setRequests((prev) =>
          Array.isArray(prev)
            ? prev.filter((r) => r.id !== selectedRequest.id)
            : [],
        );
        setVerifiedRequest(selectedRequest);
        setSelectedRequest(null);
        setShowSuccessModal(true);
      }
    } catch (error) {
      toast.error("Error", "Failed to approve verification");
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setVerifiedRequest(null);
  };

  // Rejection Handlers
  const handleRejectClick = (request) => {
    setRejectedRequest(request);
    setShowRejectionModal(true);
  };

  const handleConfirmReject = async (reason, customReason) => {
    const finalReason = customReason || reason;
    try {
      const response = await verificationService.rejectRequest(
        rejectedRequest.id,
        finalReason,
      );
      if (response.success) {
        setRequests((prev) =>
          Array.isArray(prev)
            ? prev.filter((r) => r.id !== rejectedRequest.id)
            : [],
        );
        setRejectionReason(finalReason);
        setShowRejectionModal(false);
        setShowRejectionSuccessModal(true);
      }
    } catch (error) {
      toast.error("Error", "Failed to reject verification");
    }
  };

  const handleCloseRejectionSuccess = () => {
    setShowRejectionSuccessModal(false);
    setRejectedRequest(null);
    setRejectionReason("");
  };

  const headerActions = (
    <div className="flex w-full sm:w-auto bg-white/5 p-1 sm:p-xs rounded-2xl border border-primary-blue/20">
      <button
        onClick={() => setActiveTab("requests")}
        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 sm:gap-sm px-3 sm:px-lg py-2 sm:py-sm rounded-xl transition-all ${
          activeTab === "requests"
            ? "bg-primary-blue/20 text-text-primary border border-primary-blue/50"
            : "text-text-secondary hover:text-text-primary border border-transparent"
        }`}
      >
        <img
          src="/icon_tab_requests.svg"
          alt="Requests"
          className={`w-4 h-4 ${activeTab !== "requests" && "opacity-70"}`}
        />
        <span className="hidden sm:inline-block text-sm sm:text-body-small-bold font-inter">
          Requests
        </span>
      </button>
      <button
        onClick={() => setActiveTab("verified")}
        className={`flex flex-1 sm:flex-none justify-center items-center gap-2 sm:gap-sm px-3 sm:px-lg py-2 sm:py-sm rounded-xl transition-all ${
          activeTab === "verified"
            ? "bg-primary-blue/20 text-text-primary border border-primary-blue/50"
            : "text-text-secondary hover:text-text-primary border border-transparent"
        }`}
      >
        <img
          src="/icon_tab_verified.svg"
          alt="Verified"
          className={`w-4 h-5 ${activeTab !== "verified" && "opacity-70"}`}
        />
        <span className="hidden sm:inline-block text-sm sm:text-body-small-bold font-inter">
          Verified
        </span>
      </button>
    </div>
  );

  return (
    <MainLayout
      user={{ name: "Alex Johnson", role: "admin" }}
      pageTitle="Verification Queue"
      headerRight={headerActions}
      verificationCount={requests.length}
    >
      {activeTab === "requests" ? (
        <RequestList
          requests={requests}
          stats={requestStats}
          onVerify={handleVerifyClick}
          onReject={handleRejectClick}
          loading={loading}
        />
      ) : (
        <VerifiedList />
      )}

      {/* Verification Modals */}
      <VerificationConfirmationModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirm={handleConfirmVerify}
      />
      <VerificationSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccess}
        clubName={verifiedRequest?.name}
      />

      {/* Rejection Modals */}
      <VerificationRejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onConfirm={handleConfirmReject}
        clubName={rejectedRequest?.name}
        requestType={rejectedRequest?.type}
      />
      <VerificationRejectedSuccessModal
        isOpen={showRejectionSuccessModal}
        onClose={handleCloseRejectionSuccess}
        clubName={rejectedRequest?.name}
        reason={rejectionReason}
      />
    </MainLayout>
  );
};

export default VerificationQueue;
