import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { mockBoostPackages, mockBoostLogs, mockRequests } from '../data/mockData';
import { Plus, Pencil, CheckCircle2, DollarSign, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';

const BoostController = () => {
    const navigate = useNavigate();
    const [packages] = useState(mockBoostPackages);
    const [logs] = useState(mockBoostLogs);

    // Stats data
    const stats = [
        { label: 'Active Packages', value: String(packages.length), change: '~0%', changeColor: 'text-text-secondary' },
        { label: 'Monthly Revenue', value: 'Rs. 10,000', change: '↑12%', changeColor: 'text-state-success' },
        { label: 'Total Boosts (30d)', value: '1,284', change: '↑8%', changeColor: 'text-state-success' },
        { label: 'Average Duration', value: '4.2 Days', change: 'Stable', changeColor: 'text-text-secondary' },
    ];

    return (
        <MainLayout
            user={{ name: 'Alex Johnson', role: 'admin' }}
            pageTitle="Boost Moderation"
            verificationCount={mockRequests.length}
        >
            <div className="flex flex-col gap-lg">
                {/* Title + Add Button */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-heading-small text-text-primary font-inter">Ad Boosting Packages</h1>
                        <p className="text-body-small text-text-secondary font-inter mt-1">
                            Configure and manage promotion tiers for Sri Lankan university advertisements.
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        size="medium"
                        icon={Plus}
                        onClick={() => navigate('/boost-controller/new')}
                    >
                        Add New Package
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-md">
                    {stats.map((stat, i) => (
                        <Card key={i} variant="container" padding="p-md">
                            <div className="flex flex-col gap-sm">
                                <p className="text-body-extra-small text-text-secondary font-inter">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <span className="text-heading-small text-text-primary font-inter">{stat.value}</span>
                                    <span className={`text-body-extra-small-bold font-inter ${stat.changeColor}`}>{stat.change}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Package Cards */}
                <div className="grid grid-cols-3 gap-md">
                    {packages.map((pkg) => (
                        <Card
                            key={pkg.id}
                            variant="card"
                            padding="p-lg"
                            className="hover:border-primary-blue/50 group"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-md">
                                    <h3 className="text-body-large-bold text-text-primary font-inter">{pkg.name}</h3>
                                    <button
                                        onClick={() => navigate(`/boost-controller/edit/${pkg.id}`)}
                                        className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary-blue/20 transition-colors"
                                    >
                                        <Pencil size={14} className="text-text-secondary group-hover:text-text-primary" />
                                    </button>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-heading-small text-text-primary font-inter font-bold">Rs. {pkg.price.toLocaleString()}</span>
                                    <span className="text-body-extra-small text-text-secondary font-inter">/ {pkg.duration}</span>
                                </div>

                                {/* Description */}
                                <p className="text-body-extra-small text-text-secondary font-inter mb-lg leading-relaxed">
                                    {pkg.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-col gap-sm mt-auto">
                                    {pkg.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-sm">
                                            <CheckCircle2 size={16} className="text-state-success flex-shrink-0" />
                                            <span className="text-body-small text-text-soft font-inter">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Status Footer */}
                                <div className="flex items-center justify-between mt-lg pt-md border-t border-white/10">
                                    <span className="text-body-small text-text-secondary font-inter">Active Status</span>
                                    <div className="flex items-center gap-xs">
                                        <div className="w-2 h-2 rounded-full bg-state-success animate-pulse" />
                                        <span className="text-body-small-bold text-state-success font-inter">LIVE</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Recent Configuration Changes */}
                <Card variant="card" padding="p-lg">
                    <div className="flex items-center justify-between mb-lg">
                        <div className="flex items-center gap-sm">
                            <Clock size={20} className="text-text-secondary" />
                            <h3 className="text-body-large-bold text-text-primary font-inter">Recent Configuration Changes</h3>
                        </div>
                        <button className="text-body-small-bold text-primary-blue font-inter hover:underline transition-all">
                            View All Logs
                        </button>
                    </div>
                    <div className="flex flex-col gap-md">
                        {logs.map((log) => (
                            <div
                                key={log.id}
                                className="flex items-center justify-between py-sm"
                            >
                                <div className="flex items-center gap-md">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.type === 'feature_added' ? 'bg-state-success/20' : 'bg-primary-blue/20'
                                        }`}>
                                        {log.type === 'feature_added' ? (
                                            <CheckCircle2 size={18} className="text-state-success" />
                                        ) : (
                                            <DollarSign size={18} className="text-primary-blue" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-body-small-bold text-text-primary font-inter">{log.title}</p>
                                        <p className="text-body-extra-small text-text-secondary font-inter">{log.description}</p>
                                    </div>
                                </div>
                                <span className="text-body-extra-small text-text-secondary font-inter whitespace-nowrap">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default BoostController;
