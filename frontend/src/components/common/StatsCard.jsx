import React from 'react';
import Card from './Card';

const StatsCard = ({ 
    iconSrc, 
    iconAlt, 
    iconBgClass, 
    title, 
    value, 
    subValue, 
    subValueClass = "text-state-success" 
}) => {
    return (
        <Card variant="container" className="h-40 relative group transition-colors">
            <div className={`absolute top-lg left-lg w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass}`}>
                <img src={iconSrc} alt={iconAlt} className="w-6 h-6" />
            </div>
            <div className="absolute top-[80px] left-lg">
                <p className="text-body-small-bold text-text-secondary">{title}</p>
            </div>
            <div className="absolute top-[100px] left-lg flex items-end gap-sm">
                <span className="text-heading-medium text-text-primary">{value}</span>
                {subValue && (
                    <span className={`text-body-small-bold pb-xs ${subValueClass}`}>
                        {subValue}
                    </span>
                )}
            </div>
        </Card>
    );
};

export default StatsCard;
