import React from 'react';
import Card from '../../components/common/Card';
import { Pencil, Trash2, CheckCircle2 } from 'lucide-react';

const PackageCard = ({ pkg, onEdit, onDelete }) => (
    <Card variant="card" padding="p-lg" className="hover:border-primary-blue/50 group">
        <div className="flex flex-col h-full">
            <div className="flex items-start justify-between mb-md">
                <h3 className="text-body-large-bold text-text-primary font-inter">{pkg.name}</h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(pkg)}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-blue/20 transition-colors"
                    >
                        <Pencil size={14} className="text-text-secondary group-hover:text-text-primary" />
                    </button>
                    <button
                        onClick={() => onDelete(pkg)}
                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-state-error/20 transition-colors"
                    >
                        <Trash2 size={14} className="text-text-secondary hover:text-state-error transition-colors" />
                    </button>
                </div>
            </div>

            <div className="flex items-baseline gap-1 mb-1">
                <span className="text-base md:text-heading-small text-text-primary font-inter font-bold whitespace-nowrap">Rs. {Number(pkg.price).toLocaleString()}</span>
                <span className="text-body-extra-small text-text-secondary font-inter">/ {pkg.duration}</span>
            </div>

            <p className="text-body-extra-small text-text-secondary font-inter mb-lg leading-relaxed">
                {pkg.description}
            </p>

            <div className="flex flex-col gap-sm mt-auto">
                {(pkg.features || []).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-sm">
                        <CheckCircle2 size={16} className="text-state-success flex-shrink-0" />
                        <span className="text-body-small text-text-soft font-inter">{feature}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-lg pt-md border-t border-white/10">
                <span className="text-body-small text-text-secondary font-inter">Active Status</span>
                <div className="flex items-center gap-xs">
                    <div className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
                    <span className="text-body-small-bold text-state-success font-inter">LIVE</span>
                </div>
            </div>
        </div>
    </Card>
);

export default PackageCard;
