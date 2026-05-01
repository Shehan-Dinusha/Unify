import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { useToast } from "../components/common/Toast";
import { getMyReportById } from "../services/reportService";
import {
  Calendar,
  ArrowRight,
  Shield,
  ShieldAlert,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const StudentReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();
  const user = { name: "Alex Johnson", role: "student", id: 4 };

  // ── Data State ─────────────────────────────────────────────────────
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch report from API on mount ─────────────────────────────────
  useEffect(() => {
    const loadReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMyReportById(id);
        setReport(result.data);
      } catch (err) {
        console.error('[StudentReportDetail] Failed to load:', err);
        setError('Failed to load report details. Please check the backend.');
        toast.error('Connection Error', 'Failed to load report details.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [id]);

  // ── Loading State ──────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
        <div className="flex items-center justify-center h-64 text-text-secondary text-body-small">
          Loading report details...
        </div>
      </MainLayout>
    );
  }

  // ── Error State ────────────────────────────────────────────────────
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
        <button
          onClick={() => navigate("/student/reports")}
          className="text-primary-blue hover:underline text-body-small font-inter mt-4 inline-block"
        >
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
        {/* Status Banner */}
        {['Resolved', 'Dismissed', 'Withdrawn'].includes(r.status) && (
          <div className={`w-full p-5 rounded-[24px] border flex items-center gap-5 mb-2 animate-in fade-in slide-in-from-top-4 duration-500 ${
            r.status === 'Resolved' 
              ? 'bg-state-success/10 border-state-success/30 text-state-success shadow-lg shadow-state-success/5' 
              : r.status === 'Dismissed'
              ? 'bg-state-error/10 border-state-error/30 text-state-error shadow-lg shadow-state-error/5'
              : 'bg-white/5 border-white/20 text-text-secondary'
          }`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${
              r.status === 'Resolved' ? 'bg-state-success/20' : r.status === 'Dismissed' ? 'bg-state-error/20' : 'bg-white/10'
            }`}>
              {r.status === 'Resolved' ? <CheckCircle2 size={28} /> : <AlertTriangle size={28} />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold font-inter">This report is {r.status.toLowerCase()}.</h3>
              <p className="text-sm opacity-80 font-inter mt-1">
                {r.status === 'Resolved' 
                  ? 'The administration has reviewed and resolved your report. Thank you for helping keep our community safe.' 
                  : r.status === 'Dismissed'
                  ? 'This report was reviewed and dismissed by the administration. No further action was deemed necessary.'
                  : 'You have withdrawn this report. It is no longer being processed.'}
              </p>
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-bold opacity-50 uppercase tracking-widest font-inter">Report Closed</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-white font-inter tracking-tight">
              Report {r.reportId}
            </h1>
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

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column (span 2) ─────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Reported Entity */}
            <Card variant="card" padding="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-inter mb-4">
                    Reported Entity
                  </h3>
                  <p className="text-xl font-bold text-white font-inter">
                    {r.reportedEntity.name}
                  </p>
                  <p className="text-sm text-text-secondary font-inter mt-1">
                    {r.reportedEntity.faculty}
                  </p>
                  <p className="text-xs text-text-tertiary font-inter mt-3">
                    ID: {r.reportedEntity.entityId}
                  </p>
                  <button className="text-primary-blue font-bold text-sm mt-5 mb-2 flex items-center gap-1 hover:underline transition-all">
                    View Profile <ArrowRight size={14} />
                  </button>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className="px-3 py-1.5 rounded-full bg-state-error/10 border border-state-error/20 text-state-error text-[11px] font-bold tracking-wide font-inter">
                    {r.reason || "Report"}
                  </span>
                  <img
                    src={r.reportedEntity.avatar}
                    alt={r.reportedEntity.name}
                    className="w-[100px] h-[100px] rounded-xl object-cover border-2 border-white/10"
                  />
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card variant="card" padding="p-6">
              <h3 className="text-lg font-bold text-white font-inter mb-3">
                Description
              </h3>
              <p className="text-sm text-text-secondary font-inter leading-relaxed">
                {r.description}
              </p>
            </Card>

            {/* Evidence & Attachments */}
            {r.evidence && r.evidence.length > 0 && (
              <Card variant="card" padding="p-6">
                <h3 className="text-lg font-bold text-white font-inter mb-4">
                  Evidence & Attachments
                </h3>
                <div className="flex flex-wrap gap-4">
                  {r.evidence.map((ev, i) => (
                    <a
                      key={i}
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative w-[110px] h-[110px] rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all flex-shrink-0"
                      title={`View ${ev.name}`}
                    >
                      {ev.type === "image" || ev.type === "image" ? (
                        <>
                          <img
                            src={ev.url}
                            alt="evidence"
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all"
                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200"; }}
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="bg-white/20 p-1.5 rounded mb-2 backdrop-blur-sm">
                              <ImageIcon size={16} className="text-white" />
                            </div>
                            <span className="text-[10px] text-white font-inter truncate w-full text-center drop-shadow-md">
                              {ev.name}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center p-2 hover:bg-white/10 transition-colors">
                          <FileText
                            size={24}
                            className="text-state-error/80 mb-2"
                          />
                          <span className="text-[10px] text-white font-inter truncate w-full text-center">
                            {ev.name}
                          </span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Administrative Update — from admin resolve note */}
            {r.adminNote && (
              <div className="bg-primary-blue/5 border-l-4 border-l-primary-blue rounded-r-[20px] rounded-bl-sm border-y border-r border-y-white/10 border-r-white/10 p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
                  <ShieldAlert size={20} className="text-primary-blue" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-inter mb-1">
                    Administrative Update
                  </h4>
                  <p className="text-xs text-primary-blue font-inter mb-3">
                    Posted by {r.adminNote.author} • {r.adminNote.date}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed font-inter">
                    {r.adminNote.message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column (span 1) ────────────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Status Button */}
            <button className={`w-full py-4 rounded-[100px] border flex items-center justify-center gap-2 font-inter text-sm font-bold shadow-lg ${
              r.status === 'Resolved'
                ? 'border-state-success/30 bg-state-success/10 text-state-success shadow-state-success/5'
                : r.status === 'Dismissed'
                ? 'border-state-error/30 bg-state-error/10 text-state-error shadow-state-error/5'
                : r.status === 'Withdrawn'
                ? 'border-white/20 bg-white/10 text-text-secondary shadow-white/5'
                : r.status === 'In Progress' || r.status === 'In Review'
                ? 'border-state-warning/30 bg-state-warning/10 text-state-warning shadow-state-warning/5'
                : 'border-primary-blue/30 bg-primary-blue/10 text-primary-blue shadow-primary-blue/5'
            }`}>
              {r.status === 'Resolved' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              Status: {r.status === 'In Progress' ? 'In Review' : (r.statusLabel || r.status)}
            </button>

            {/* Timeline */}
            <Card variant="card" padding="p-6">
              <h3 className="text-lg font-bold text-white font-inter mb-6">
                Report Timeline
              </h3>
              <div className="flex flex-col">
                {r.timeline && r.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 pb-6 last:pb-0 relative"
                  >
                    {idx < r.timeline.length - 1 && (
                      <div className="absolute left-[7px] top-6 bottom-0 w-px bg-white/10" />
                    )}
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-1 z-10 ${
                      step.status === 'completed' ? 'bg-state-success' : 
                      step.status === 'active' ? 'bg-primary-blue shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/10'
                    }`}>
                      {step.status === 'completed' && <CheckCircle2 size={10} className="text-white" />}
                      {step.status === 'active' && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold font-inter ${step.status === 'active' ? 'text-primary-blue' : 'text-white'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] text-text-tertiary font-inter uppercase tracking-wider mb-1">
                        {step.date}
                      </p>
                      {step.description && (
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Detailed Activity Log */}
            {r.activityLog && r.activityLog.length > 0 && (
              <Card variant="card" padding="p-6">
                <h3 className="text-lg font-bold text-white font-inter mb-6">
                  Detailed Activity Log
                </h3>
                <div className="flex flex-col gap-5">
                  {r.activityLog.slice().reverse().map((log, i) => (
                    <div key={i} className="flex flex-col gap-1 border-l-2 border-white/5 pl-4 ml-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white font-inter">{log.title}</span>
                        <span className="text-[10px] text-text-tertiary font-inter">{log.time}</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed font-inter">
                        {log.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Privacy Shield */}
            <Card variant="card" padding="p-6">
              <div className="flex items-start gap-3">
                <Shield
                  size={20}
                  className="text-state-success flex-shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="text-white font-bold text-sm font-inter">
                    Privacy Protected
                  </h4>
                  <p className="text-text-secondary text-xs font-inter mt-2 leading-relaxed">
                    Your identity is encrypted and only visible to the head of
                    the disciplinary committee.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentReportDetail;
