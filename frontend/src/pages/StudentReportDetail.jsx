import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import { mockStudentReports } from "../data/mockReportData";
import {
  Calendar,
  Search,
  ArrowRight,
  Shield,
  ShieldAlert,
  Image as ImageIcon,
  FileText,
  CheckCircle2
} from "lucide-react";

const StudentReportDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const report = mockStudentReports.find((r) => r.id === id);
  const user = { name: "Alex Johnson", role: "student" };

  if (!report) {
    return (
      <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-text-secondary text-body-medium font-inter">
            Report not found.
          </p>
          <button
            onClick={() => navigate("/student/reports")}
            className="text-primary-blue hover:underline text-body-small font-inter mt-2"
          >
            Go back to reports
          </button>
        </div>
      </MainLayout>
    );
  }

  const r = report;

  return (
    <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto">
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
          <button
            onClick={() => navigate(`/student/reports/${r.id}/withdraw`)}
            className="px-5 py-2.5 rounded-[100px] bg-primary-blue hover:brightness-110 text-white font-inter text-sm font-semibold transition-all shadow-lg shadow-primary-blue/20"
          >
            Withdraw Report
          </button>
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
                    {r.reportType || "Academic Misconduct"}
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
            <Card variant="card" padding="p-6">
              <h3 className="text-lg font-bold text-white font-inter mb-4">
                Evidence & Attachments
              </h3>
              <div className="flex flex-wrap gap-4">
                {r.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="relative w-[110px] h-[110px] rounded-xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/20 transition-all flex-shrink-0"
                  >
                    {ev.type === "image" ? (
                      <>
                        <img
                          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=200"
                          alt="evidence"
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-gradient-to-t from-black/60 to-transparent">
                          <div className="bg-white/20 p-1.5 rounded mb-2 backdrop-blur-sm">
                            <ImageIcon size={16} className="text-white" />
                          </div>
                          <span className="text-[10px] text-white font-inter truncate w-full text-center drop-shadow-md">
                            whatsapp_screen...
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
                          email_thread.pdf
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Administrative Update */}
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
            <button className="w-full py-4 rounded-[100px] border border-primary-blue/30 bg-primary-blue/10 text-primary-blue flex items-center justify-center gap-2 font-inter text-sm font-bold shadow-lg shadow-primary-blue/5">
              <Search size={16} className="text-primary-blue" /> Status:{" "}
              {r.statusLabel}
            </button>

            {/* Timeline */}
            <Card variant="card" padding="p-6">
              <h3 className="text-lg font-bold text-white font-inter mb-6">
                Report Timeline
              </h3>
              <div className="flex flex-col">
                {r.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 pb-6 last:pb-0 relative"
                  >
                    {idx < r.timeline.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-0 w-px bg-white/10" />
                    )}
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 z-10 ${
                        step.status === "completed" || step.status === "active"
                          ? "bg-primary-blue"
                          : "bg-white/10 border border-white/20"
                      }`}
                    >
                      {(step.status === "completed" ||
                        step.status === "active") && (
                        <CheckCircle2 size={12} className="text-white bg-primary-blue rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold font-inter ${
                          step.status === "active" || step.status === "completed"
                            ? "text-white"
                            : "text-text-tertiary"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-[11px] text-text-secondary font-inter mt-1.5 tracking-wide">
                          {step.date}
                        </p>
                      )}
                      {step.description && (
                        <p className="text-xs text-text-tertiary font-inter mt-2 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

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

            {/* Help Link */}
            <div className="text-center mt-2">
              <button className="text-primary-blue hover:text-blue-400 hover:underline transition-colors text-sm font-inter">
                Need help with this report?
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentReportDetail;
