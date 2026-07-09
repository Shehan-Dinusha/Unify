import React from 'react';
import Card from '../../components/common/Card';
import { CheckCircle2 } from 'lucide-react';

const BenefitsList = ({ benefits }) => (
  <Card variant="container" padding="p-lg">
    <h4 className="text-body-medium-bold text-text-primary font-inter mb-md">Included Benefits</h4>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
      {benefits.map((benefit, idx) => (
        <div key={idx} className="flex items-center gap-sm">
          <div className="w-5 h-5 rounded-md bg-primary-blue/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={13} className="text-primary-blue" />
          </div>
          <span className="text-body-small text-text-soft font-inter">{benefit}</span>
        </div>
      ))}
    </div>
  </Card>
);

export default BenefitsList;
