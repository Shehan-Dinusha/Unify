import React from 'react';
import Card from '../../components/common/Card';
import { DonutChart } from '../../components/chart';

const RevenueBreakdown = ({ segments, centerLabel }) => (
    <div className="col-span-1 md:col-span-2">
        <Card variant="container" className="h-full">
            <h3 className="text-body-large-bold text-text-primary">Revenue Breakdown</h3>
            <p className="text-body-extra-small text-text-secondary mt-xs mb-lg">Distribution by source category</p>

            <div className="flex flex-col items-center">
                <DonutChart segments={segments} size={160} strokeWidth={22} centerLabel={centerLabel} centerSubLabel="Total LKR" />

                <div className="grid grid-cols-2 gap-x-lg gap-y-sm w-full mt-lg">
                    {segments.map((seg) => (
                        <div key={seg.label} className="flex flex-col gap-xs">
                            <div className="flex items-center gap-xs">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                                <span className="text-body-extra-small text-text-secondary truncate">{seg.label}</span>
                            </div>
                            <span className="text-body-small-bold text-text-primary pl-[18px]">{seg.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    </div>
);

export default RevenueBreakdown;
