import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { CheckCircle2, CalendarDays, ArrowRight } from 'lucide-react';

const BoostSuccessContent = ({ packageName, durationDays, transactionId, activationTimestamp, expiryTimestamp, budget, onViewFeed, onMyPosts }) => (
  <Card variant="modal" padding="p-0" className="max-w-sm my-auto">
    <div className="p-6 sm:p-8 pb-4 sm:pb-6 flex flex-col items-center text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-state-success/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 ring-4 ring-state-success/5">
        <CheckCircle2 size={28} className="text-state-success sm:hidden" />
        <CheckCircle2 size={32} className="text-state-success hidden sm:block" />
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">Boost Activated Successfully</h2>
      <p className="text-text-secondary text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-sm">
        Your listing is now being promoted to a wider audience with premium priority.
      </p>

      <div className="w-full bg-white/5 rounded-2xl border border-white/10 overflow-hidden mb-4 sm:mb-6">
        <div className="p-md sm:p-lg flex items-center gap-md">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} className="text-primary-blue" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center gap-sm">
              <h4 className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter truncate">{packageName} Boost</h4>
              <span className="text-[10px] font-bold bg-state-success/15 text-state-success px-2 py-0.5 rounded-full flex-shrink-0">Active</span>
            </div>
            <p className="text-body-extra-small text-text-secondary font-inter">ID: {transactionId}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <CalendarDays size={11} className="text-text-secondary" />
              <span className="text-body-extra-small text-text-secondary font-inter">Ends in {durationDays} days</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 grid grid-cols-3 divide-x divide-white/10">
          <div className="p-md sm:p-lg text-left">
            <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Budget</p>
            <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">Rs.{Number(budget).toLocaleString()}</p>
          </div>
          <div className="p-md sm:p-lg text-left">
            <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Activated</p>
            <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">{activationTimestamp}</p>
          </div>
          <div className="p-md sm:p-lg text-left">
            <p className="text-body-extra-small text-text-secondary font-inter mb-0.5">Expires</p>
            <p className="text-body-small-bold sm:text-body-medium-bold text-text-primary font-inter">{expiryTimestamp}</p>
          </div>
        </div>
      </div>
    </div>

    <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-1 sm:pt-2 flex flex-col gap-3">
      <Button onClick={onViewFeed} variant="gradient" fullWidth size="medium" className="h-11 sm:h-12 gap-2.5">
        View Boosted Listing <ArrowRight size={18} />
      </Button>
      <button onClick={onMyPosts}
        className="w-full h-11 sm:h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200">
        Return to My Posts
      </button>
    </div>
  </Card>
);

export default BoostSuccessContent;
