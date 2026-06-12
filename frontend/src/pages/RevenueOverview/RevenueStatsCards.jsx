import React from 'react';
import Card from '../../components/common/Card';

const RevenueStatsCards = ({ tiles }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
        {tiles.map((tile, i) => (
            <Card key={i} variant="container" className="hover:border-primary-blue/30 transition-colors h-auto md:h-44 md:relative">
                <div className="hidden md:block">
                    <div className={`absolute top-lg left-lg w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tile.iconBg}`}>
                        <span className="text-lg">{tile.icon}</span>
                    </div>
                    <div className="absolute top-[72px] left-lg right-lg">
                        <p className="text-body-small-bold text-text-secondary truncate">{tile.title}</p>
                    </div>
                    <div className="absolute top-[94px] left-lg right-lg">
                        <p className="text-heading-medium text-text-primary">{tile.value}</p>
                        <p className={`text-body-extra-small mt-xs ${tile.changeClass} truncate`}>{tile.change}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-sm md:hidden">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tile.iconBg}`}>
                        <span className="text-lg">{tile.icon}</span>
                    </div>
                    <p className="text-body-small-bold text-text-secondary">{tile.title}</p>
                    <div>
                        <p className="text-lg font-bold text-text-primary whitespace-nowrap">{tile.value}</p>
                        <p className={`text-body-extra-small mt-xs ${tile.changeClass}`}>{tile.change}</p>
                    </div>
                </div>
            </Card>
        ))}
    </div>
);

export default RevenueStatsCards;
