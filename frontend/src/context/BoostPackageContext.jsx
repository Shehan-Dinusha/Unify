import React, { createContext, useContext, useState } from 'react';
import { mockBoostPackages, mockBoostLogs } from '../data/mockData';

const BoostPackageContext = createContext();

export const useBoostPackages = () => useContext(BoostPackageContext);

// Helper to format relative time
const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) +
        ', ' + date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const BoostPackageProvider = ({ children }) => {
    const [packages, setPackages] = useState(mockBoostPackages);
    const [logs, setLogs] = useState(mockBoostLogs);

    const pushLog = (log) => {
        setLogs(prev => [log, ...prev]);
    };

    const addPackage = (pkg) => {
        const newPkg = {
            ...pkg,
            id: `pkg-${String(Date.now()).slice(-5)}`,
            status: 'live',
        };
        setPackages(prev => [...prev, newPkg]);
        pushLog({
            id: `log-${Date.now()}`,
            type: 'package_added',
            title: `New package '${pkg.name}' created`,
            description: `Tier added with pricing: Rs. ${Number(pkg.price).toLocaleString()} / ${pkg.duration}`,
            time: `Just now • ${formatTime(new Date())}`,
        });
        return newPkg;
    };

    const updatePackage = (id, updatedData) => {
        const existing = packages.find(p => p.id === id);
        setPackages(prev => prev.map(p => p.id === id ? { ...p, ...updatedData } : p));
        pushLog({
            id: `log-${Date.now()}`,
            type: 'package_updated',
            title: `Package '${updatedData.name || existing?.name}' updated`,
            description: `Configured: Rs. ${Number(updatedData.price).toLocaleString()} / ${updatedData.duration}`,
            time: `Just now • ${formatTime(new Date())}`,
        });
    };

    const deletePackage = (id) => {
        const existing = packages.find(p => p.id === id);
        setPackages(prev => prev.filter(p => p.id !== id));
        pushLog({
            id: `log-${Date.now()}`,
            type: 'package_deleted',
            title: `Package '${existing?.name}' removed`,
            description: 'Package tier has been decommissioned from active lists',
            time: `Just now • ${formatTime(new Date())}`,
        });
    };

    return (
        <BoostPackageContext.Provider value={{ packages, logs, addPackage, updatePackage, deletePackage }}>
            {children}
        </BoostPackageContext.Provider>
    );
};
