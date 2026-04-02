import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import { CheckCircle2, ArrowRight, LayoutDashboard, CalendarDays } from 'lucide-react';

const BoostPostSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    packageName = 'Growth',
    budget = 500,
    durationDays = 7,
  } = location.state || {};

  const campaignId = `#Campaign-${Math.floor(1000 + Math.random() * 9000)}-X`;
  const campaignName = 'Summer Sale Campaign';

  return (
    <MainLayout
      user={{ name: 'Alex Johnson', role: 'business', displayRole: 'Business & Organization' }}
      pageTitle="Boost Your Post"
      verificationCount={0}
    >
      {/* Success Modal — inside MainLayout so sidebar shows behind blur */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-1/80 backdrop-blur-xl transition-all duration-300 px-4 py-6 overflow-y-auto">
        <Card
          variant="card"
          padding="p-0"
          className="w-full max-w-[480px] overflow-hidden outline outline-1 outline-offset-[-1px] outline-white/10 shadow-2xl my-auto"
        >
          <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
              <CheckCircle2 size={28} className="text-state-success sm:hidden" />
              <CheckCircle2 size={32} className="text-state-success hidden sm:block" />
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
              Boost Activated Successfully
            </h2>
            <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm">
              Your listing is now being promoted to a wider audience with premium priority.
            </p>

            {/* Campaign Details Card */}
            <div className="w-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-4 sm:mb-6">
              {/* Campaign Header */}
              <div className="p-md sm:p-lg flex items-center gap-md">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 overflow-hidden flex-shrink-0">
                  <img
                    src="/img_post1.jpg"
                    alt="Campaign"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-sm">
                    <h4 className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter truncate">
                      {campaignName}
                    </h4>
                    <span className="text-[10px] font-bold bg-state-success/15 text-state-success px-2 py-0.5 rounded-full flex-shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-body-extra-small text-text-secondary font-inter">
                    ID: {campaignId}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <CalendarDays size={11} className="text-text-secondary" />
                    <span className="text-body-extra-small text-text-secondary font-inter">
                      Ends in {durationDays} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="border-t border-white/10 grid grid-cols-3 divide-x divide-white/10">
                <div className="p-md sm:p-lg text-left">
                  <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Budget</p>
                  <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">
                    Rs.{budget.toLocaleString()}
                  </p>
                </div>
                <div className="p-md sm:p-lg text-left">
                  <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Est. Reach</p>
                  <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">
                    ~5k Views
                  </p>
                </div>
                <div className="p-md sm:p-lg text-left">
                  <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Placement</p>
                  <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">
                    Homepage
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
            <button
              onClick={() => navigate('/news-feed')}
              className="w-full h-11 sm:h-12 rounded-2xl bg-gradient-to-r from-primary-blue to-blue-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200"
            >
              View Boosted Listing <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/news-feed')}
              className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200"
            >
              Return to Dashboard
            </button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BoostPostSuccess;
