import React from 'react';
import { Eye, Heart, ArrowRight } from 'lucide-react';
import Card from '../../components/common/Card';

const BoostLivePreview = ({ selectedPkg }) => (
  <div className="lg:col-span-3">
    <Card variant="card" padding="p-lg" className="h-full">
      <div className="flex items-center gap-sm mb-lg">
        <Eye size={18} className="text-primary-blue" />
        <span className="text-body-medium-bold text-text-primary font-inter">Live Preview</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-lg">
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/5">
            <div className="h-28 sm:h-36 overflow-hidden bg-gradient-to-br from-white/10 to-white/5">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-body-small text-text-secondary font-inter">Ad Preview Image</span>
              </div>
            </div>
            <div className="p-md">
              <h4 className="text-body-small-bold text-text-primary font-inter mb-1">Your Boosted Post</h4>
              <p className="text-body-extra-small text-text-secondary font-inter leading-relaxed mb-md">
                This post will appear with priority placement across the platform.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-primary-blue text-body-small-bold font-inter flex items-center gap-1 cursor-pointer hover:underline">
                  Shop Now <ArrowRight size={14} />
                </span>
                <div className="flex items-center gap-1 text-text-secondary">
                  <Heart size={14} />
                  <span className="text-body-extra-small font-inter">7.4k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-md justify-center">
          <h4 className="text-body-medium-bold text-text-primary font-inter">
            What you get with &ldquo;{selectedPkg.name}&rdquo;:
          </h4>
          <ul className="flex flex-col gap-sm">
            <li className="flex items-start gap-sm">
              <span className="text-text-secondary mt-1.5 text-[6px]">●</span>
              <span className="text-body-small text-text-secondary font-inter leading-relaxed">
                Your ad appears in the <span className="text-text-primary font-semibold">Top 3</span> spots of the category.
              </span>
            </li>
            <li className="flex items-start gap-sm">
              <span className="text-text-secondary mt-1.5 text-[6px]">●</span>
              <span className="text-body-small text-text-secondary font-inter leading-relaxed">
                Primary color border attracts <span className="text-text-primary font-semibold">25% more clicks</span>.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  </div>
);

export default BoostLivePreview;
