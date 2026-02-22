import React, { useState } from 'react';
import { X, AlertTriangle, Lock, CheckCircle, BadgeX, FileX } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const RevokePrivilegesModal = ({ isOpen, onClose, onConfirm }) => {
    const [step, setStep] = useState('confirm'); // 'confirm' | 'success'
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        // In real app, validate password via API
        setStep('success');
        if (onConfirm) onConfirm();
    };

    const handleClose = () => {
        setStep('confirm');
        setPassword('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={step === 'confirm' ? handleClose : undefined}
            />

            {/* ── STEP 1: Confirm Revoke ── */}
            {step === 'confirm' && (
                <div className="relative w-full max-w-sm bg-gray-900 rounded-3xl border border-white/10 shadow-custom-shadow animate-in fade-in zoom-in duration-200 overflow-hidden">
                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-1 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors z-10"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {/* Body */}
                    <div className="p-8 flex flex-col gap-6">
                        {/* Header row: icon + title */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full border border-red-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-red-400" />
                            </div>
                            <div className="flex flex-col gap-1 pt-1">
                                <h3 className="text-white text-body-medium-bold font-bold font-inter">Revoke Privileges?</h3>
                                <p className="text-text-secondary text-body-small font-inter">This action cannot be undone.</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-300 text-body-small leading-5 font-inter">
                            You are about to remove your <span className="font-bold">Batch Representative</span> status.
                            You will immediately <span className="font-bold">lose access</span> to the rep dashboard,
                            student verification tools, and club management features.
                        </p>

                        {/* Password field */}
                        <div className="flex flex-col gap-2">
                            <label className="text-text-secondary text-body-small font-bold font-inter">
                                Enter Password to Confirm
                            </label>
                            <Input
                                icon={Lock}
                                type="password"
                                placeholder="Account password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                size="small"
                                fullWidth
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                size="small"
                                fullWidth
                                onClick={handleConfirm}
                            >
                                Confirm Removal
                            </Button>
                        </div>
                    </div>

                    {/* Footer note */}
                    <div className="px-6 py-3 bg-gray-800 border-t border-white/5 flex items-center justify-center gap-1.5">
                        <Lock className="w-3 h-3 text-text-secondary" />
                        <span className="text-text-secondary text-body-extra-small font-inter">
                            Requires Admin approval to reinstate
                        </span>
                    </div>
                </div>
            )}

            {/* ── STEP 2: Role Removed Success ── */}
            {step === 'success' && (
                <div className="relative w-full max-w-sm bg-gray-900 rounded-3xl border border-white/10 shadow-custom-shadow animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <div className="p-8 flex flex-col items-center gap-8">
                        {/* Icon + heading */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full border border-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-9 h-9 text-green-400" />
                            </div>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h3 className="text-white text-heading-small font-bold font-inter">Role Removed</h3>
                                <p className="text-gray-300 text-body-small font-inter leading-5">
                                    You have successfully removed yourself as a Batch Representative.
                                </p>
                            </div>
                        </div>

                        {/* Access changes card */}
                        <div className="w-full p-5 bg-dark-4 rounded-2xl border border-white/5 flex flex-col gap-3">
                            <p className="text-text-secondary text-body-small font-bold font-inter">Access Changes</p>
                            <ul className="flex flex-col gap-3">
                                <li className="flex items-center gap-3">
                                    <BadgeX className="w-4 h-4 text-text-secondary shrink-0" />
                                    <span className="text-text-secondary text-body-small font-inter">Representative badge removed from profile</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-text-secondary shrink-0" />
                                    <span className="text-text-secondary text-body-small font-inter">Administrative tools access revoked</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <FileX className="w-4 h-4 text-text-secondary shrink-0" />
                                    <span className="text-text-secondary text-body-small font-inter">Document management disabled</span>
                                </li>
                            </ul>
                        </div>

                        {/* Done button */}
                        <Button
                            variant="primary"
                            size="small"
                            fullWidth
                            onClick={handleClose}
                        >
                            Done
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RevokePrivilegesModal;
