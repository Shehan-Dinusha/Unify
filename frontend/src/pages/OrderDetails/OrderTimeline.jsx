import React from "react";
import Card from "../../components/common/Card";

const OrderTimeline = ({ timeline }) => (
  <Card variant="container" padding="p-xl" className="border-white/10">
    <h3 className="text-heading-small text-text-primary mb-xl">Order Status</h3>
    <div className="space-y-0">
      {timeline.map((item, index) => (
        <div key={index} className="flex gap-lg group">
          <div className="flex flex-col items-center">
            <div className={`
              relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
              ${item.status === 'completed' ? 'bg-state-success/15 text-state-success shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                : item.status === 'current' ? 'bg-primary-blue text-white shadow-[0_0_20px_rgba(43,140,238,0.4)]'
                  : 'bg-white/5 text-text-tertiary border border-white/5'}
            `}>
              <item.icon size={item.status === 'upcoming' ? 16 : 20} className={item.status === 'current' ? 'animate-pulse' : ''} />
            </div>
            {index !== timeline.length - 1 && (
              <div className={`w-0.5 h-16 transition-all duration-700 ${item.status === 'completed' ? 'bg-state-success' : 'bg-white/5'}`} />
            )}
          </div>
          <div className="pt-2 pb-8">
            <h4 className={`text-body-medium-bold ${item.status === 'upcoming' ? 'text-text-tertiary' : 'text-text-primary'}`}>{item.title}</h4>
            {item.date && <p className="text-body-extra-small text-text-tertiary mt-1">{item.date}</p>}
          </div>
        </div>
      ))}
    </div>
  </Card>
);

export default OrderTimeline;
