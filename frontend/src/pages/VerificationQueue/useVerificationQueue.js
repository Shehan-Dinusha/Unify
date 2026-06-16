import { useState, useEffect } from "react";
import verificationService from "../../services/verificationService";

export const useVerificationQueue = () => {
  const [errorStatus, setErrorStatus] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [requestStats, setRequestStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verifiedRequest, setVerifiedRequest] = useState(null);

  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showRejectionSuccessModal, setShowRejectionSuccessModal] = useState(false);
  const [rejectedRequest, setRejectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const lastViewed = localStorage.getItem("verificationLastViewed") || undefined;
      const response = await verificationService.getPendingRequests(lastViewed);
      if (response.success) {
        setRequests(response.data?.requests || []);
        setRequestStats(response.data?.stats || null);
        localStorage.setItem("verificationLastViewed", Date.now().toString());
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorStatus(403);
        return;
      }
      setErrorMessage("Failed to fetch pending requests.");
      setShowErrorModal(true);
      setRequests([]);
      setRequestStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = (request) => setSelectedRequest(request);

  const handleConfirmVerify = async () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setRequests((prev) => Array.isArray(prev) ? prev.filter((r) => r.id !== selectedRequest.id) : []);
    setRequestStats((prev) => {
      if (!prev) return prev;
      return { ...prev, totalPending: Math.max(0, (prev.totalPending || 0) - 1), newPending: Math.max(0, (prev.newPending || 0) - 1), approvedToday: (prev.approvedToday || 0) + 1 };
    });
    try {
      const response = await verificationService.approveRequest(selectedRequest.id);
      if (response.success) {
        setVerifiedRequest(selectedRequest);
        setSelectedRequest(null);
        setShowSuccessModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to approve verification. Please try again.");
      setShowErrorModal(true);
      fetchRequests();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    setVerifiedRequest(null);
  };

  const handleRejectClick = (request) => {
    setRejectedRequest(request);
    setShowRejectionModal(true);
  };

  const handleConfirmReject = async (reason, customReason) => {
    if (isRejecting) return;
    setIsRejecting(true);
    const finalReason = customReason || reason;
    setRequests((prev) => Array.isArray(prev) ? prev.filter((r) => r.id !== rejectedRequest.id) : []);
    setRequestStats((prev) => {
      if (!prev) return prev;
      return { ...prev, totalPending: Math.max(0, (prev.totalPending || 0) - 1), newPending: Math.max(0, (prev.newPending || 0) - 1), rejectedToday: (prev.rejectedToday || 0) + 1 };
    });
    try {
      const response = await verificationService.rejectRequest(rejectedRequest.id, finalReason);
      if (response.success) {
        setRejectionReason(finalReason);
        setShowRejectionModal(false);
        setShowRejectionSuccessModal(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to reject verification. Please try again.");
      setShowErrorModal(true);
      fetchRequests();
    } finally {
      setIsRejecting(false);
    }
  };

  const handleCloseError = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleCloseRejectionSuccess = () => {
    setShowRejectionSuccessModal(false);
    setRejectedRequest(null);
    setRejectionReason("");
  };

  return {
    errorStatus, activeTab, setActiveTab, requests, requestStats, loading,
    selectedRequest, setSelectedRequest, showSuccessModal, verifiedRequest,
    showRejectionModal, setShowRejectionModal, showRejectionSuccessModal, rejectedRequest, rejectionReason,
    showErrorModal, errorMessage, handleVerifyClick, handleConfirmVerify, handleCloseSuccess,
    handleRejectClick, handleConfirmReject, handleCloseError, handleCloseRejectionSuccess, fetchRequests,
    isVerifying, isRejecting,
  };
};
