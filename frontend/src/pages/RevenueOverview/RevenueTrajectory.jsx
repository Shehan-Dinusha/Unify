import React from 'react';
import Card from '../../components/common/Card';
import { LineChart } from '../../components/chart';

const RevenueTrajectory = ({ months, actualRevenue, projectedRevenue, MAX_REV, yAxisLabels, TOOLTIP_IDX }) => (
    <div className="col-span-1 md:col-span-3">
        <Card variant="container">
            <div className="flex items-start justify-between mb-sm">
                <div>
                    <h3 className="text-body-large-bold text-text-primary">Revenue Trajectory</h3>
                    <p className="text-body-extra-small text-text-secondary mt-xs">
                        Comparing actual revenue vs AI-driven projections for the fiscal year
                    </p>
                </div>
                <div className="flex items-center gap-lg shrink-0 ml-md">
                    <div className="flex items-center gap-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />
                        <span className="text-body-extra-small text-text-secondary">Actual</span>
                    </div>
                    <div className="flex items-center gap-xs">
                        <div className="w-2.5 h-2.5 rounded-full bg-text-secondary" />
                        <span className="text-body-extra-small text-text-secondary">Projected</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-sm items-stretch mt-md">
                <div className="flex flex-col justify-between text-body-extra-small text-text-secondary text-right shrink-0 pb-6" style={{ height: 340 }}>
                    {yAxisLabels.map((l) => <span key={l}>{l}</span>)}
                </div>
                <div className="flex-1 min-w-0">
                    <LineChart actual={actualRevenue} projected={projectedRevenue} maxVal={MAX_REV} tooltipIdx={TOOLTIP_IDX} />
                    <div className="flex mt-1">
                        {months.map((m, i) => (
                            <div key={m} className="flex-1 text-center">
                                <span className={`text-body-extra-small ${i === TOOLTIP_IDX ? 'text-primary-blue font-bold' : 'text-text-secondary'}`}>{m}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    </div>
);

export default RevenueTrajectory;
