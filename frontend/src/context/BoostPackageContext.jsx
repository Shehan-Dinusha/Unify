import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as boostAPI from '../services/boostService';
import { getCurrentUser, isAuthenticated } from '../services/authService';

const BoostPackageContext = createContext();

export const useBoostPackages = () => useContext(BoostPackageContext);

export const BoostPackageProvider = ({ children }) => {
    const [packages, setPackages] = useState([]);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ── Fetch packages from DB on mount ────────────────────────────────
    const fetchPackages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await boostAPI.getPackages();
            if (response.success && response.data?.packages) {
                setPackages(response.data.packages);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // ── Fetch logs from DB on mount ────────────────────────────────────
    const fetchLogs = useCallback(async () => {
        try {
            const response = await boostAPI.getBoostLogs();
            if (response.success && response.data?.logs) {
                setLogs(response.data.logs);
            }
        } catch (err) {
        }
    }, []);

    // ── Fetch stats from DB ────────────────────────────────────────────
    const fetchStats = useCallback(async () => {
        try {
            const response = await boostAPI.getAdminStats();
            if (response.success && response.data?.stats) {
                setStats(response.data.stats);
            }
        } catch (err) {
        }
    }, []);

    // ── Load all data on mount ─────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated()) return;
        const user = getCurrentUser();
        const isAdmin = user?.role === "Admin";
        fetchPackages();
        if (isAdmin) {
            fetchLogs();
            fetchStats();
        }
    }, [fetchPackages, fetchLogs, fetchStats]);

    // ── Add Package (calls API) ────────────────────────────────────────
    const addPackage = async (pkgData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await boostAPI.createPackage(pkgData);
            if (response.success && response.data) {
                // Refresh packages and logs from DB
                await fetchPackages();
                await fetchLogs();
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ── Update Package (calls API) ─────────────────────────────────────
    const updatePackage = async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await boostAPI.updatePackage(id, updatedData);
            if (response.success) {
                // Refresh packages and logs from DB
                await fetchPackages();
                await fetchLogs();
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ── Delete Package (calls API) ─────────────────────────────────────
    const deletePackage = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await boostAPI.deletePackage(id);
            if (response.success) {
                // Refresh packages and logs from DB
                await fetchPackages();
                await fetchLogs();
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ── Purchase Boost (calls API) ─────────────────────────────────────
    const purchaseBoost = async (packageId, postId = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await boostAPI.purchaseBoost(packageId, postId);
            if (response.success) {
                return response.data;
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <BoostPackageContext.Provider
            value={{
                packages,
                logs,
                stats,
                loading,
                error,
                addPackage,
                updatePackage,
                deletePackage,
                purchaseBoost,
                fetchPackages,
                fetchLogs,
                fetchStats,
            }}
        >
            {children}
        </BoostPackageContext.Provider>
    );
};
