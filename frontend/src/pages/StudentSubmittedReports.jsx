import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Card from "../components/common/Card";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Button from "../components/common/Button";
import { useToast } from "../components/common/Toast";
import { getMyReports } from "../services/reportService";
import { getCurrentUser } from "../services/authService";
import {
  Plus,
  Search,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "Pending Review", label: "● Pending Review" },
  { value: "Resolved", label: "● Resolved" },
  { value: "In Progress", label: "● In Progress" },
  { value: "Withdrawn", label: "● Withdrawn" },
  { value: "Dismissed", label: "● Dismissed" },
];

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "inappropriate", label: "⚠️ Inappropriate" },
  { value: "spam", label: "📩 Spam" },
  { value: "harassment", label: "🚫 Harassment" },
  { value: "misinformation", label: "📰 Misinformation" },
];

const getStatusStyle = (status) => {
  switch (status) {
    case "Pending Review":
      return "text-state-warning bg-state-warning/10 border border-state-warning/30";
    case "Resolved":
      return "text-state-success bg-state-success/10 border border-state-success/30";
    case "In Progress":
      return "text-primary-blue bg-primary-blue/10 border border-primary-blue/30";
    case "Withdrawn":
      return "text-text-secondary bg-white/10 border border-white/20";
    case "Dismissed":
      return "text-state-error bg-state-error/10 border border-state-error/30";
    default:
      return "text-text-secondary bg-white/10 border border-white/20";
  }
};

// Show 'In Review' label for 'In Progress' so it matches the admin queue display
const getStatusLabel = (status) => status === 'In Progress' ? 'In Review' : status;

const StudentSubmittedReports = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Reports");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // ── Data State (mirrors StudentManagement pattern) ──────────────────
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = getCurrentUser() || { name: "Student", role: "student" };

  // ── Fetch Reports from API ─────────────────────────────────────────
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getMyReports({
          status: statusFilter,
          category: categoryFilter,
          search: searchQuery,
        });
        setReports(result.data?.reports || []);
      } catch (err) {
        console.error('[StudentSubmittedReports] Failed to load:', err);
        setError('Failed to connect to the server. Please make sure the backend is running.');
        toast.error('Connection Error', 'Failed to load your reports.');
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [statusFilter, categoryFilter, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilter("All Reports");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <MainLayout user={user} pageTitle="Submitted Report" verificationCount={0}>
      {/* ── Header Row ────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-md mb-lg">
        <div>
          <h2 className="text-heading-small text-text-primary">
            My Submitted Reports
          </h2>
          <p className="text-body-small text-text-secondary mt-xs">
            Track the status of your reports submitted to the administration.
          </p>
        </div>
        <div className="w-full md:w-72">
          <Input
            icon={Search}
            placeholder="Search by title or ID...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── Filters Row ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-md mb-md">
        {/* Tab: All Reports */}
        <button
          onClick={() => {
            setActiveFilter("All Reports");
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
          className={`px-lg py-sm rounded-xl text-body-small-bold font-inter border transition-all ${
            activeFilter === "All Reports"
              ? "bg-primary-blue/20 text-primary-blue border-primary-blue/50"
              : "border-white/10 text-text-secondary hover:text-text-primary hover:bg-white/5"
          }`}
        >
          All Reports
        </button>

        {/* Category Filter */}
        <div className="w-full md:w-52">
          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-44">
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>

        <div className="hidden md:block flex-1" />

        {/* Reset */}
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-xs text-body-small-bold text-state-error hover:text-state-error/80 transition-colors"
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      </div>

      {/* ── Submit New Report Button ────── */}
      <div className="mb-md flex justify-start">
        <Button
          onClick={() => navigate("/student/report-issue")}
          variant="gradient" size="medium" className="h-11 gap-2"
        >
          <Plus size={18} /> Submit New Report
        </Button>
      </div>

      {/* ── Loading State ──────────────────────────────────── */}
      {loading && (
        <div className="flex items-center justify-center h-40 text-text-secondary text-body-small">
          Loading your reports...
        </div>
      )}

      {/* ── Error State ──────────────────────────────────── */}
      {error && !loading && (
        <Card variant="container" className="border-state-error/30 bg-state-error/5 mb-lg">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Backend Unavailable</p>
              <p className="text-body-small text-text-secondary">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* ── Student Table (Desktop) ───────────────────────── */}
      {!loading && !error && (
        <>
          <div className="relative overflow-hidden border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm mb-lg hidden md:block">
            {/* Header */}
            <div
              className="grid gap-md px-lg py-md border-b border-white/10"
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr" }}
            >
              <span className="text-body-small-bold text-text-secondary">
                Report Title
              </span>
              <span className="text-body-small-bold text-text-secondary">
                Category
              </span>
              <span className="text-body-small-bold text-text-secondary">
                Date Submitted
              </span>
              <span className="text-body-small-bold text-text-secondary">
                Status
              </span>
              <span className="text-body-small-bold text-text-secondary text-right">
                Actions
              </span>
            </div>

            {/* Rows */}
            {reports.map((report, idx) => (
              <div
                key={report.id}
                className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${
                  idx < reports.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr" }}
              >
                {/* Title & ID */}
                <div className="min-w-0">
                  <p className="text-body-medium-bold text-text-primary truncate">
                    {report.title}
                  </p>
                  <p className="text-body-extra-small text-text-secondary truncate">
                    ID: {report.reportId}
                  </p>
                </div>

                {/* Category */}
                <div className="flex items-center gap-2">
                  <span className="text-sm">{report.categoryIcon}</span>
                  <span className="text-body-small text-text-secondary truncate">
                    {report.category}
                  </span>
                </div>

                {/* Date */}
                <span className="text-body-small text-text-secondary">
                  {report.dateSubmitted}
                </span>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg ${getStatusStyle(
                      report.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        report.status === "Pending Review"
                          ? "bg-state-warning"
                          : report.status === "Resolved"
                            ? "bg-state-success"
                            : report.status === "In Progress"
                              ? "bg-primary-blue"
                              : report.status === "In Review"
                                ? "bg-purple-500"
                                : "bg-state-error"
                      }`}
                    />
                    {getStatusLabel(report.status)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => navigate(`/student/reports/${report.id}`)}
                    className="px-md py-xs rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue hover:shadow-lg hover:shadow-primary-blue/25 transition-all duration-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-text-secondary text-body-medium font-inter">
                  No reports found
                </p>
                <p className="text-text-tertiary text-body-small font-inter mt-1">
                  Try adjusting your filters or submit a new report.
                </p>
              </div>
            )}
          </div>

          {/* ── Mobile Cards View ──────────────────────────────── */}
          <div className="grid grid-cols-1 gap-md md:hidden mb-lg">
            {reports.map((report) => (
              <Card
                key={report.id}
                variant="container"
                className="hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col gap-md">
                  {/* Top: Title + Status */}
                  <div className="flex items-center gap-md">
                    <div className="min-w-0 flex-1">
                      <p className="text-body-medium-bold text-text-primary truncate">
                        {report.title}
                      </p>
                      <p className="text-body-extra-small text-text-secondary truncate">
                        ID: {report.reportId}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg shrink-0 ${getStatusStyle(
                        report.status
                      )}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          report.status === "Pending Review"
                            ? "bg-state-warning"
                            : report.status === "Resolved"
                              ? "bg-state-success"
                              : report.status === "In Progress"
                                ? "bg-primary-blue"
                                : report.status === "In Review"
                                  ? "bg-purple-500"
                                  : "bg-state-error"
                        }`}
                      />
                      {getStatusLabel(report.status)}
                    </span>
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center justify-between">
                    <span className="text-body-small text-text-secondary">
                      {report.categoryIcon} {report.category}
                    </span>
                    <span className="text-body-extra-small text-text-secondary">
                      {report.dateSubmitted}
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => navigate(`/student/reports/${report.id}`)}
                    className="w-full py-sm rounded-lg bg-primary-blue/15 text-primary-blue border border-primary-blue/30 text-body-extra-small font-semibold hover:bg-primary-blue hover:text-white hover:border-primary-blue transition-all duration-200 text-center"
                  >
                    View Details
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default StudentSubmittedReports;
