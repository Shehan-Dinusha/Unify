import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import Overlay from '../../components/common/Overlay';
import { useToast } from '../../components/common/Toast';
import { submitReport } from '../../services/reportService';
import { getCurrentUser } from '../../services/authService';
import { Send, X } from 'lucide-react';
import ReportTypeSelector from './ReportTypeSelector';
import ReportReasonSelector from './ReportReasonSelector';
import ReportDetailsForm from './ReportDetailsForm';
import SubmitConfirmModal from './SubmitConfirmModal';

const StudentReportIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const postData = location.state?.postData || null;

  const [selectedType, setSelectedType] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [externalLink, setExternalLink] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (postData?.type) {
      setSelectedType(postData.type);
    } else if (postData?.id) {
      setSelectedType('post');
    }
  }, [postData]);

  const user = getCurrentUser() || { name: 'Student', role: 'student' };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((f) => ({
      file: f, name: f.name, size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: f.name.endsWith('.pdf') ? 'pdf' : 'image',
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    try {
      const categoryMap = { inappropriate: 'inappropriate', spam: 'spam', harassment: 'harassment', misinformation: 'misinformation' };
      const formData = new FormData();
      formData.append('reportType', selectedType);
      formData.append('category', categoryMap[selectedReason] || selectedReason);
      const entityId = postData?.id || postData?.authorId || postData?.userId;
      formData.append('reportedEntityId', entityId || `manual-${Date.now()}`);
      if (additionalDetails) formData.append('additionalDetails', additionalDetails);
      if (externalLink) formData.append('evidenceUrl', externalLink);
      uploadedFiles.forEach((item) => formData.append('evidenceFiles', item.file));

      const result = await submitReport(formData);
      toast.success('Report Submitted', 'Your report has been sent to the administration.');
      navigate('/student/report-success', {
        state: { reportId: result.data?.reportId || '', reportType: selectedType, reason: selectedReason },
      });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit report. Please try again.';
      toast.error('Submission Failed', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (location.state?.from) navigate(location.state.from);
    else navigate('/news-feed');
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedType) newErrors.type = 'Please select a report type.';
    if (!selectedReason) newErrors.reason = 'Please select a reason for reporting.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShowConfirm = () => {
    if (validate()) {
      setShowConfirm(true);
    } else {
      toast.error('Required Fields Missing', 'Please select a report type and reason before submitting.');
    }
  };

  const canSubmit = selectedType !== null && selectedReason !== null;

  return (
    <MainLayout user={user} pageTitle="News Feed" verificationCount={0}>
      <Overlay open={true} className="overflow-y-auto">
        <div className="min-h-full flex items-center justify-center py-6 sm:py-10">
          <Card variant="modal" padding="p-0" className="max-w-lg">
            <div className="p-5 sm:p-6 pb-0 flex items-start justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-inter tracking-tight">Report an Issue</h2>
                <p className="text-xs sm:text-sm text-text-secondary font-inter mt-1">Help us keep the university community safe and professional.</p>
              </div>
              <button onClick={handleCancel} className="p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6 flex flex-col gap-6 max-h-[calc(100vh-160px)] overflow-y-auto scrollbar-hide">
              <ReportTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} error={errors.type} />
              <div className="w-full h-px bg-white/10" />
              <ReportReasonSelector selectedReason={selectedReason} setSelectedReason={setSelectedReason} error={errors.reason} />
              <div className="w-full h-px bg-white/10" />
              <ReportDetailsForm
                additionalDetails={additionalDetails} setAdditionalDetails={setAdditionalDetails}
                uploadedFiles={uploadedFiles} handleFileUpload={handleFileUpload} removeFile={removeFile}
                externalLink={externalLink} setExternalLink={setExternalLink}
              />
            </div>

            <div className="p-5 sm:p-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button onClick={handleCancel} className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors font-inter order-2 sm:order-1">Cancel</button>
              <button onClick={handleShowConfirm} className={`w-full sm:w-auto h-11 px-6 rounded-full font-inter font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 order-1 sm:order-2 ${canSubmit ? 'bg-primary-blue text-white hover:brightness-110 active:scale-[0.98]' : 'bg-white/5 border border-white/10 text-text-tertiary'}`}>
                Submit Report <Send size={16} />
              </button>
            </div>
          </Card>
        </div>
      </Overlay>

      <SubmitConfirmModal open={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={confirmSubmit} submitting={submitting} />
    </MainLayout>
  );
};

export default StudentReportIssue;
