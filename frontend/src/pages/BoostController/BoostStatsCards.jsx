import React from 'react';
import Card from '../../components/common/Card';

const BoostStatsCards = ({ statTiles }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
        {statTiles.map((stat, i) => (
            <Card key={i} variant="container" padding="p-md">
                <div className="flex flex-col gap-sm">
                    <p className="text-body-extra-small text-text-secondary font-inter">{stat.label}</p>
                    <div className="flex items-end justify-between">
                        <span className="text-base md:text-heading-small text-text-primary font-inter whitespace-nowrap">{stat.value}</span>
                        <span className={`text-body-extra-small-bold font-inter ${stat.changeColor}`}>{stat.change}</span>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

export default BoostStatsCards;
