import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Card from '../../components/common/Card';
import { useStudentReportDetail } from './useStudentReportDetail';
import ReportStatusBanner from './ReportStatusBanner';
import ReportedEntityCard from './ReportedEntityCard';
import EvidenceAttachments from './EvidenceAttachments';
import ReportTimeline from './ReportTimeline';
import { AdminNote, ActivityLogSection, PrivacyShield } from './ActivityLog';

const StudentReportDetail = () => {
  const { report, loading, error, user, navigate } = useStudentReportDetail();

  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
        <div className="flex items-center justify-center h-64 text-text-secondary text-body-small">Loading report details...</div>
      </MainLayout>
    );
  }

  if (error || !report) {
    return (
      <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
        <Card variant="container" className="border-state-error/30 bg-state-error/5">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Failed to Load Report</p>
              <p className="text-body-small text-text-secondary">{error || 'Report not found.'}</p>
            </div>
          </div>
        </Card>
        <button onClick={() => navigate('/student/reports')} className="text-primary-blue hover:underline text-body-small font-inter mt-4 inline-block">
          Go back to reports
        </button>
      </MainLayout>
    );
  }

  const r = report;
  const isWithdrawable = !['Withdrawn', 'Resolved', 'Dismissed'].includes(r.status);

  return (
    <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
        <ReportStatusBanner status={r.status} />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white font-inter tracking-tight">Report {r.reportId}</h1>
            <p className="text-sm text-text-secondary mt-2 flex items-center gap-2 font-inter">
              <Calendar size={14} /> Submitted on {r.dateSubmittedFull}
            </p>
          </div>
          {isWithdrawable && (
            <button
              onClick={() => navigate(`/student/reports/${r.internalId || r.id}/withdraw`)}
              className="px-5 py-2.5 rounded-[100px] bg-primary-blue hover:brightness-110 text-white font-inter text-sm font-semibold transition-all shadow-lg shadow-primary-blue/20"
            >
              Withdraw Report
            </button>
          )}
          {r.status === 'Withdrawn' && (
            <span className="px-5 py-2.5 rounded-[100px] bg-white/10 border border-white/20 text-text-secondary font-inter text-sm font-semibold">
              Report Withdrawn
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5">
            <ReportedEntityCard r={r} />

            <Card variant="card" padding="p-6">
              <h3 className="text-lg font-bold text-white font-inter mb-3">Description</h3>
              <p className="text-sm text-text-secondary font-inter leading-relaxed">{r.description}</p>
            </Card>

            <EvidenceAttachments evidence={r.evidence} />
            <AdminNote adminNote={r.adminNote} />
          </div>

          <div className="lg:col-span-1 flex flex-col gap-5">
            <ReportTimeline timeline={r.timeline} status={r.status} statusLabel={r.statusLabel} />
            <ActivityLogSection activityLog={r.activityLog} />
            <PrivacyShield />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentReportDetail;
