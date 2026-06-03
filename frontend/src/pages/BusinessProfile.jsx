import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import { getBusinessProfile, updateBusinessStatus } from '../services/businessService';
import {
  Mail,
  MapPin,
  Star,
  X,
  UserX,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react';
import { getAvatarUrl } from '../utils/formatters';
import { getCurrentUser } from '../services/authService';

// ─── Main Page ────────────────────────────────────────────────────────────────

const BusinessProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useToast();

  /* ── Data state ──────────────────────────────────── */
  const [biz, setBiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  /* ── Fetch profile from backend on mount ────────── */
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBusinessProfile(id);
        setBiz(result.data);
      } catch (err) {
        console.error('[BusinessProfile] Failed to load profile:', err);
        setError('Failed to load business profile. Please check backend.');
        toast.error('Connection Error', 'Could not load business profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  /* ── Modal state ─────────────────────────────────── */
  const [modal, setModal] = useState(null);     // 'suspend'
  const [success, setSuccess] = useState(null); // 'suspend' | 'message'
  const [suspendReason, setSuspendReason] = useState('Violation of Terms');
  const [suspendDetail, setSuspendDetail] = useState('');
  const [sendEmail, setSendEmail] = useState(true);

  const openModal = (m) => setModal(m);
  const closeModal = () => { setModal(null); setSuspendDetail(''); };
  
  /* ── Confirm actions — calls real backend ─────────── */
  const confirmAction = async (type) => {
    setActionLoading(true);
    try {
      if (type === 'suspend') {
        await updateBusinessStatus(id, {
          status: 'Suspended',
          suspensionCategory: suspendReason,
          reason: suspendDetail,
          sendEmail,
        });
        toast.success('Suspended', `${biz.name}'s business has been suspended.`);
      } else if (type === 'activate') {
        await updateBusinessStatus(id, {
          status: 'Active',
        });
        toast.success('Activated', `${biz.name}'s business access has been restored.`);
      } else if (type === 'message') {
        // Mock message logic
        toast.success('Message Sent', `Message sent to ${biz.name} successfully.`);
      }
      closeModal();
      setSuccess(type);
      
      // Re-fetch data to update UI
      try {
        const result = await getBusinessProfile(id);
        setBiz(result.data);
      } catch (e) {
        console.error('Failed to refresh business data:', e);
      }
    } catch (err) {
      const msg = err.message || 'Action failed. Please try again.';
      toast.error('Action Failed', msg);
    } finally {
      setActionLoading(false);
    }
  };

  const closeSuccess = (dest) => {
    setSuccess(null);
    if (dest === 'dashboard') navigate('/admin');
    else navigate('/active-businesses');
  };

  const statsArray = biz ? [biz.stats.revenue, biz.stats.ads, biz.stats.engagement] : [];

  /* ═══════════════════════════════════════════════════════
     MODALS
     ═══════════════════════════════════════════════════════ */

  const renderSuspendModal = () => {
    if (modal !== 'suspend') return null;
    const reasons = ['Violation of Terms', 'Spam Activity', 'Non-payment'];
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
        <div className="min-h-full flex items-center justify-center px-4 py-6">
          <Card variant="modal" padding="p-0" className="w-full max-w-[500px]">
            <div className="w-full h-1 bg-white/5 rounded-t-3xl overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-primary-blue to-primary-accent rounded-r" /></div>
            <div className="p-lg flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-state-error/10 rounded-full flex items-center justify-center"><UserX size={20} className="text-state-error" /></div>
                  <div><h3 className="text-body-large-bold text-text-primary">Suspend Business</h3><p className="text-body-extra-small text-text-secondary">This action requires administrator confirmation.</p></div>
                </div>
                <button onClick={closeModal} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-dark-2 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                  <img src={getAvatarUrl(biz.logo, biz.name)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{biz.name}</p><p className="text-body-extra-small text-text-secondary">{biz.businessId}</p></div>
                <span className="inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg bg-state-success/10 text-state-success border border-state-success/30"><span className="w-1.5 h-1.5 rounded-full bg-state-success" />ACTIVE</span>
              </div>
              <p className="text-body-small text-text-secondary leading-relaxed mb-5">Are you sure you want to suspend this business? This will immediately revoke their advertising access and hide their profile from the platform.</p>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2"><label className="text-body-small-bold text-text-primary">Reason for suspension</label><span className="text-body-extra-small text-text-tertiary">Required</span></div>
                <div className="flex flex-wrap gap-2">
                  {reasons.map(reason => (
                    <button key={reason} onClick={() => setSuspendReason(reason)} className={`px-3.5 py-1.5 rounded-xl text-body-small font-medium transition-all ${suspendReason === reason ? 'bg-primary-blue/20 text-primary-blue border border-primary-blue/40' : 'bg-white/5 text-text-secondary border border-white/10 hover:bg-white/10'}`}>{reason}</button>
                  ))}
                </div>
              </div>
              <textarea 
                value={suspendDetail} 
                onChange={(e) => setSuspendDetail(e.target.value)} 
                placeholder="Enter detailed reason here...." 
                className={`w-full h-24 bg-white/5 rounded-2xl border ${!suspendDetail.trim() ? 'border-state-error/50' : 'border-white/10'} p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors mb-2`} 
              />
              {!suspendDetail.trim() && (
                <p className="text-[10px] text-state-error mb-4 ml-1 italic font-medium">* Reason is required to proceed with suspension</p>
              )}
              <label className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setSendEmail(!sendEmail)}>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${sendEmail ? 'bg-primary-blue border-primary-blue' : 'border-white/20 bg-transparent'}`}>{sendEmail && <CheckCircle2 size={14} className="text-white" />}</div>
                <span className="text-body-small text-text-secondary">Send email notification to business owner</span>
              </label>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => suspendDetail.trim() && confirmAction('suspend')} 
                  disabled={!suspendDetail.trim() || actionLoading}
                  className={`w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 ${(!suspendDetail.trim() || actionLoading) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                >
                  <UserX size={18} /> {actionLoading ? 'Suspending...' : 'Confirm Suspension'}
                </button>
                <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">Cancel</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderMessageModal = () => {
    if (modal !== 'message') return null;
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
        <div className="min-h-full flex items-center justify-center px-4 py-6">
          <Card variant="modal" padding="p-0" className="">
            <div className="p-lg flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-blue/10 rounded-full flex items-center justify-center ring-4 ring-primary-blue/5"><Mail size={20} className="text-primary-blue" /></div>
                  <div><h3 className="text-body-large-bold text-text-primary">Send Message</h3><p className="text-body-extra-small text-text-secondary">To: {biz.name}</p></div>
                </div>
                <button onClick={closeModal} className="p-2 text-text-secondary hover:text-text-primary transition-colors"><X size={20} /></button>
              </div>
              <div className="mb-4">
                <label className="text-body-small-bold text-text-primary mb-2 block">Subject</label>
                <input placeholder="Enter subject..." className="w-full h-12 bg-white/5 rounded-2xl border border-white/10 px-4 text-body-small text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary-blue/50 transition-colors" />
              </div>
              <div className="mb-6">
                <label className="text-body-small-bold text-text-primary mb-2 block">Message</label>
                <textarea placeholder="Type your message here..." className="w-full h-32 bg-white/5 rounded-2xl border border-white/10 p-md text-body-small text-text-primary placeholder:text-text-secondary resize-none focus:outline-none focus:border-primary-blue/50 transition-colors" />
              </div>
              <div className="flex flex-col gap-3">
                <button onClick={() => confirmAction('message')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><Mail size={18} /> Send Message</button>
                <button onClick={closeModal} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">Cancel</button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderSuccessModal = () => {
    if (!success) return null;
    const configs = {
      suspend: { title: 'Business Suspended', desc: `${biz.name} has been suspended. All active campaigns have been paused and the profile is hidden from the platform.`, icon: <CheckCircle2 size={36} className="text-state-success" />, ringClass: 'ring-state-success/5 bg-state-success/10' },
      message: { title: 'Message Sent!', desc: `Your message has been sent to ${biz.name} successfully.`, icon: <CheckCircle2 size={36} className="text-state-success" />, ringClass: 'ring-state-success/5 bg-state-success/10' },
    };
    const cfg = configs[success];
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-dark-1/80 backdrop-blur-xl transition-all duration-300">
        <div className="min-h-full flex items-center justify-center px-4 py-6">
          <Card variant="modal" padding="p-0" className="">
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-4 ${cfg.ringClass}`}>{cfg.icon}</div>
              <h2 className="text-xl font-bold text-white mb-3">{cfg.title}</h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-5">{cfg.desc}</p>
              {success === 'suspend' && (
                <div className="w-full bg-white/5 rounded-xl border border-white/10 p-md flex items-center gap-3 text-left">
                  <div className="w-11 h-11 rounded-xl bg-dark-2 border border-white/20 overflow-hidden flex items-center justify-center shrink-0">
                    <img src={getAvatarUrl(biz.logo, biz.name)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary">{biz.name}</p><p className="text-body-extra-small text-text-secondary">{biz.businessId}</p></div>
                  <span className="px-2.5 py-1 bg-state-error/20 text-state-error text-xs font-bold rounded-md border border-state-error/30">Suspended</span>
                </div>
              )}
            </div>
            <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
              <button onClick={() => closeSuccess('dashboard')} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"><ArrowLeft size={18} /> Return to Dashboard</button>
              <button onClick={() => closeSuccess('list')} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"><RotateCcw size={18} className="text-text-secondary" /> View Active Businesses</button>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════
     MAIN RENDER
     ═══════════════════════════════════════════════════════ */
  // Loading & Error guards
  if (loading) {
    return (
      <MainLayout user={{ name: 'Admin', role: 'admin' }} pageTitle="Loading Profile...">
        <div className="flex items-center justify-center h-64">
          <p className="text-text-secondary text-body-medium">Loading business profile...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !biz) {
    return (
      <MainLayout user={{ name: 'Admin', role: 'admin' }} pageTitle="Error">
        <Card variant="container" className="border-state-error/30 bg-state-error/5">
          <div className="flex items-center gap-md">
            <AlertTriangle size={24} className="text-state-error shrink-0" />
            <div>
              <p className="text-body-medium-bold text-state-error">Failed to Load Profile</p>
              <p className="text-body-small text-text-secondary">{error || 'Business not found.'}</p>
            </div>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      user={getCurrentUser() || { name: 'Admin', role: 'Admin' }}
      pageTitle={`${biz.name}'s Profile`}
    >
      {biz.status === 'Suspended' && (
        <div className="mb-lg p-lg rounded-2xl bg-state-error/10 border border-state-error/30 flex items-center gap-md animate-pulse">
          <div className="w-12 h-12 rounded-full bg-state-error/20 flex items-center justify-center">
            <AlertTriangle size={24} className="text-state-error" />
          </div>
          <div>
            <p className="text-body-large-bold text-state-error font-inter uppercase tracking-wider">Business Suspended</p>
            <p className="text-body-small text-text-secondary font-inter">This business has been restricted. All active ads and campaigns are currently hidden.</p>
          </div>
        </div>
      )}
      {/* ── Business Header Card ───────────────────────── */}
      <Card variant="container" className="py-3 px-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Logo with verified badge - Large size, Minimal padding */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-dark-2 border border-white/20 overflow-hidden flex items-center justify-center">
              <img src={getAvatarUrl(biz.logo, biz.name)} alt={biz.name} className="w-full h-full object-cover" />
            </div>
            {biz.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-state-success flex items-center justify-center border-2 border-dark-1 shadow-lg shadow-state-success/40">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </span>
            )}
          </div>

          {/* Name + Meta - High contrast typography */}
          <div className="flex-1 min-w-0">
            <h2 className="text-heading-small text-text-primary font-inter mb-0.5 tracking-tight">{biz.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-body-extra-small text-text-secondary font-inter">
              <span className="flex items-center gap-1.5 font-bold opacity-80">
                ID: {biz.businessId}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-1.5 opacity-80 font-medium">
                <MapPin size={12} className="text-text-tertiary" /> {biz.location}
              </span>
            </div>
          </div>

          {/* Action Buttons - Plump pills from common component */}
          <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
            {biz.status !== 'Suspended' && (
              <Button 
                variant="danger" 
                size="medium"
                onClick={() => openModal('suspend')} 
                className="flex-1 sm:flex-none h-11 px-8"
              >
                Suspend
              </Button>
            )}
            <Button 
              variant="primary" 
              size="medium" 
              icon={Mail}
              disabled={biz.status === 'Suspended'}
              onClick={() => openModal('message')} 
              className={`flex-1 sm:flex-none h-11 px-10 ${biz.status === 'Suspended' ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              Message
            </Button>
          </div>
        </div>
      </Card>

      {/* ── Stats Row ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
        {statsArray.map((stat, i) => (
          <Card key={i} variant="container" className="hover:border-primary-blue/30 transition-colors">
            <div className="flex items-start justify-between mb-sm">
              <p className="text-body-small text-text-secondary font-inter">{stat.label}</p>
              <span className={`px-sm py-xs rounded-lg text-body-extra-small-bold font-inter ${stat.badgeClass}`}>{stat.badge}</span>
            </div>
            <p className="text-heading-small text-text-primary font-inter">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* ── Bottom: Business Info + Activity + Sentiment ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left (2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          {/* Business Information */}
          <Card variant="container">
            <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Business Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-xl gap-y-lg">
              <div><p className="text-body-small text-text-secondary font-inter mb-xs">Primary Email</p><p className="text-body-medium text-text-primary font-inter">{biz.businessInfo.email}</p></div>
              <div><p className="text-body-small text-text-secondary font-inter mb-xs">Phone Number</p><p className="text-body-medium text-text-primary font-inter">{biz.businessInfo.phone}</p></div>
              <div><p className="text-body-small text-text-secondary font-inter mb-xs">Website</p><a href={`https://${biz.businessInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-body-medium text-primary-blue font-inter hover:underline">{biz.businessInfo.website}</a></div>
              <div><p className="text-body-small text-text-secondary font-inter mb-xs">Registered Address</p><p className="text-body-medium text-text-primary font-inter whitespace-pre-line">{biz.businessInfo.address}</p></div>
            </div>
          </Card>

          {/* Recent Activity Log */}
          <Card variant="container">
            <h3 className="text-body-large-bold text-text-primary font-inter mb-lg">Recent Activity Log</h3>
            <div className="flex flex-col">
              {biz.activityLog.map((entry, idx) => (
                <div key={entry.id} className={`flex items-start gap-md py-md ${idx < biz.activityLog.length - 1 ? 'border-b border-white/5' : ''}`}>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${entry.iconColor}`}>{entry.icon}</span>
                  <div className="flex-1 min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{entry.title}</p><p className="text-body-extra-small text-text-secondary font-inter">{entry.detail}</p></div>
                  <span className="text-body-extra-small text-text-secondary font-inter shrink-0">{entry.time}</span>
                </div>
              ))}
              {biz.activityLog.length === 0 && (<div className="text-center text-body-small text-text-secondary font-inter py-lg">No recent activity.</div>)}
            </div>
          </Card>
        </div>

        {/* Right (1/3): Sentiment & Reviews */}
        <div className="lg:col-span-1">
          <Card variant="container" className="h-full">
            <div className="flex items-center gap-sm mb-lg">
              <span className="w-8 h-8 rounded-lg bg-state-error/20 flex items-center justify-center"><span className="text-sm">📊</span></span>
              <h3 className="text-body-large-bold text-text-primary font-inter">User Sentiment & Reviews</h3>
            </div>

            {/* Star Rating Bars */}
            <div className="flex flex-col gap-md mb-xl">
              {biz.sentiment.ratings.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-md">
                  <span className="text-body-small-bold text-text-primary font-inter w-4 text-right shrink-0">{rating.stars}</span>
                  <Star size={14} className="text-state-warning shrink-0" fill="#FBBF24" />
                  <div className="flex-1 h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${rating.percentage}%`, backgroundColor: rating.color }} />
                  </div>
                  <span className="text-body-extra-small text-text-secondary font-inter w-10 text-right shrink-0">{rating.percentage}%</span>
                </div>
              ))}
            </div>

            {/* Overall Rating */}
            <div className="border-t border-white/10 pt-lg">
              <p className="text-body-small text-text-secondary font-inter mb-xs">Overall Rating</p>
              <div className="flex items-center gap-sm">
                <span className="text-heading-medium text-text-primary font-inter">{biz.sentiment.overallRating}</span>
                <Star size={22} className="text-state-warning" fill="#FBBF24" />
              </div>
            </div>
          </Card>
        </div>
      </div>


      {/* Modals */}
      {renderSuspendModal()}
      {renderMessageModal()}
      {renderSuccessModal()}
    </MainLayout>
  );
};

export default BusinessProfile;
