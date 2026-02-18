import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { mockRequests } from '../data/mockData';
import { 
    VerificationConfirmationModal, 
    VerificationSuccessModal, 
    VerificationRejectionModal, 
    VerificationRejectedSuccessModal 
} from '../components/common/VerificationModals';

const VerificationQueue = () => {

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verifiedRequest, setVerifiedRequest] = useState(null);

  // Rejection State
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showRejectionSuccessModal, setShowRejectionSuccessModal] = useState(false);
  const [rejectedRequest, setRejectedRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleVerifyClick = (request) => {
    setSelectedRequest(request);
  };

  const handleConfirmVerify = () => {
    // In a real app, you would make an API call here
    setVerifiedRequest(selectedRequest);
    setSelectedRequest(null);
    setShowSuccessModal(true);
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

  const handleConfirmReject = (reason, customReason) => {
    // In a real app, API call here
    setRejectionReason(customReason ? customReason : reason);
    setShowRejectionModal(false);
    setShowRejectionSuccessModal(true);
  };

  const handleCloseRejectionSuccess = () => {
    setShowRejectionSuccessModal(false);
    setRejectedRequest(null);
    setRejectionReason('');
  };

  const filteredRequests = mockRequests.filter(req => {
    const matchesFilter = filter === 'All' || req.type === filter;
    const matchesSearch = req.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const headerActions = (
    <div className="flex bg-white/5 p-xs rounded-2xl border border-primary-blue/20">
      <button className="flex items-center gap-sm px-lg py-sm bg-primary-blue/20 text-text-primary rounded-xl border border-primary-blue/50 transition-all">
        <img src="/icon_tab_requests.svg" alt="Requests" className="w-4 h-4" />
        <span className="text-body-small-bold font-inter">Requests</span>
      </button>
      <button className="flex items-center gap-sm px-lg py-sm text-text-secondary hover:text-text-primary transition-all">
         <img src="/icon_tab_verified.svg" alt="Verified" className="w-4 h-5" />
        <span className="text-body-small-bold font-inter">Verified</span>
      </button>
    </div>
  );

  return (
    <MainLayout
      user={{ name: "Alex Johnson", role: "admin" }}
      pageTitle="Verification Queue"
      headerRight={headerActions}
      verificationCount={mockRequests.length}
    >
      <div className="flex flex-col gap-xl w-full max-w-[1122px]">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Total Pending */}
          <Card variant="container" className="h-40 relative group hover:bg-white/10 transition-colors">
             <div className="absolute top-lg left-lg w-10 h-10 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <img src="/icon_total_pending.svg" alt="Pending" className="w-6 h-6" />
             </div>
             <div className="absolute top-[80px] left-lg">
                <p className="text-body-small-bold text-text-primary">Total Pending</p>
             </div>
             <div className="absolute top-[100px] left-lg flex items-end gap-sm">
                <span className="text-heading-medium text-text-primary">{mockRequests.length}</span>
                <span className="text-body-small-bold text-state-success pb-xs">+2 new</span>
             </div>
          </Card>

          {/* Approved Today */}
          <Card variant="container" className="h-40 relative group hover:bg-white/10 transition-colors">
             <div className="absolute top-lg left-lg w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                <img src="/icon_approved_today.svg" alt="Approved" className="w-6 h-6" />
             </div>
             <div className="absolute top-[80px] left-lg">
                <p className="text-body-small-bold text-text-primary">Approved Today</p>
             </div>
             <div className="absolute top-[100px] left-lg">
                <span className="text-heading-medium text-text-primary">5</span>
             </div>
          </Card>

          {/* Rejected Today */}
          <Card variant="container" className="h-40 relative group hover:bg-white/10 transition-colors">
             <div className="absolute top-lg left-lg w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                 <img src="/icon_rejected_today.svg" alt="Rejected" className="w-6 h-6" />
             </div>
             <div className="absolute top-[80px] left-lg">
                <p className="text-body-small-bold text-text-primary">Rejected Today</p>
             </div>
             <div className="absolute top-[100px] left-lg">
                <span className="text-heading-medium text-text-primary">2</span>
             </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card variant="container" className="">
            <div className="flex flex-col md:flex-row justify-between items-center gap-md">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <img src="/icon_search.svg" alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] opacity-50" />
                    <input 
                        type="text" 
                        placeholder="Search by name, ID or entity..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-md bg-dark-4 border border-white/10 rounded-lg text-body-small text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-blue transition-colors"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-sm w-full md:w-auto overflow-x-auto pb-xs md:pb-0">
                    <Button 
                        size="small" 
                        variant={filter === 'All' ? 'primary' : 'secondary'} 
                        className={`h-9 whitespace-nowrap ${filter !== 'All' ? 'bg-dark-4 text-text-secondary border border-white/10' : ''}`}
                        onClick={() => setFilter('All')}
                    >
                        All Requests
                    </Button>
                    <Button 
                        size="small" 
                        variant={filter === 'Club' ? 'primary' : 'secondary'} 
                        className={`h-9 whitespace-nowrap ${filter !== 'Club' ? 'bg-dark-4 text-text-secondary border border-white/10' : ''}`}
                        onClick={() => setFilter('Club')}
                    >
                        Clubs
                    </Button>
                    <Button 
                        size="small" 
                        variant={filter === 'Batch Rep' ? 'primary' : 'secondary'} 
                        className={`h-9 whitespace-nowrap ${filter !== 'Batch Rep' ? 'bg-dark-4 text-text-secondary border border-white/10' : ''}`}
                        onClick={() => setFilter('Batch Rep')}
                    >
                        Batch Reps
                    </Button>
                </div>
            </div>
        </Card>

        {/* Request List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filteredRequests.map((req) => (
                <Card key={req.id} variant="container" className="h-full">
                    <div className="flex flex-col gap-lg h-full">
                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                            <div className="flex gap-sm">
                                <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full border border-white/10 object-cover" />
                                <div>
                                    <h3 className="text-body-medium-bold text-text-primary">{req.name}</h3>
                                    <div className="flex items-center gap-sm mt-1">
                                        <span className={`px-sm py-xs rounded text-body-extra-small-bold font-inter ${
                                            req.type === 'Club' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-purple-900/30 text-purple-300'
                                        }`}>
                                            {req.type}
                                        </span>
                                        <span className="text-text-secondary text-body-extra-small font-normal">• {req.time}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-xs bg-yellow-900/20 rounded flex items-center justify-center">
                               <img src="/icon_pending.svg" alt="Pending Status" className="w-3 h-3 text-yellow-500" />
                            </div>
                        </div>

                        {/* File Preview */}
                        <div className="p-sm bg-dark-4 rounded-lg border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-sm overflow-hidden">
                                <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${
                                    req.fileType === 'pdf' ? 'bg-red-900/20' : 
                                    req.fileType === 'doc' ? 'bg-blue-900/20' : 'bg-orange-900/20'
                                }`}>
                                   {req.fileType === 'pdf' && <img src="/icon_file_pdf.svg" className="w-5 h-5" />}
                                   {req.fileType === 'doc' && <img src="/icon_docs.svg" className="w-5 h-5" />}
                                   {req.fileType === 'image' && <img src="/icon_image.svg" className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-text-primary text-body-small font-medium truncate">{req.file}</p>
                                    <p className="text-text-secondary text-body-extra-small">{req.fileSize}</p>
                                </div>
                            </div>
                            <button className="flex-shrink-0 text-text-secondary hover:text-primary-blue transition-colors">
                                <img src="/icon_view.svg" alt="View" className="w-5 h-5 opacity-50 hover:opacity-100" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-sm mt-auto">
                            <Button 
                                variant="dangerOutline" 
                                className="h-[42px] border-state-error/30 text-state-error hover:bg-state-error/10 hover:border-state-error/50"
                                onClick={() => handleRejectClick(req)}
                            >
                                Reject
                            </Button>
                            <Button 
                                variant="primary" 
                                className="h-[42px] shadow-none bg-primary-blue hover:bg-primary-blue/90"
                                onClick={() => handleVerifyClick(req)}
                            >
                                Verify
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      </div>

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
