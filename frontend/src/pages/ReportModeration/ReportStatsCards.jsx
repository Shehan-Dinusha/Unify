import React from 'react';
import Card from '../../components/common/Card';
import { TrendingUp, ShieldAlert, ShieldCheck } from 'lucide-react';

const iconMap = {
    TrendingUp,
    ShieldAlert,
    ShieldCheck,
};

const ReportStatsCards = ({ stats }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {stats.map((s, i) => {
            const Icon = iconMap[s.icon];
            return (
                <Card key={i} variant="container" className={`${s.cardBg} h-36 flex items-center justify-center`}>
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                            {Icon && <Icon size={24} className={s.iconColor} />}
                        </div>
                        <div>
                            <span className="text-heading-small text-text-primary block">{s.value}</span>
                            <p className="text-body-small text-text-secondary">{s.label}</p>
                        </div>
                    </div>
                </Card>
            );
        })}
    </div>
);

export default ReportStatsCards;
