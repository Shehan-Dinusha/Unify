import React from 'react';
import Card from '../../components/common/Card';
import Overlay from '../../components/common/Overlay';
import StatusIcon from '../../components/common/StatusIcon';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ open, target, isDeleting, onConfirm, onCancel }) => (
    <Overlay open={open} onClose={onCancel}>
        <Card variant="modal" padding="p-0" className="max-w-sm">
            <div className="p-8 pb-6 flex flex-col items-center text-center">
                <StatusIcon variant="error" size="lg" icon={<AlertTriangle size={32} className="text-state-error" />} />
                <h2 className="text-xl font-bold text-white mb-3">Delete Package?</h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-2 max-w-sm">
                    Are you sure you want to delete the <span className="text-text-primary font-semibold">&quot;{target?.name}&quot;</span> package? This action cannot be undone.
                </p>
            </div>
            <div className="px-8 pb-8 pt-2 flex flex-col gap-3">
                <button
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-state-error to-red-500 text-white font-inter font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-state-error/30 hover:shadow-xl hover:shadow-state-error/40 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Package'}
                </button>
                <button onClick={onCancel} disabled={isDeleting} className="w-full h-12 rounded-2xl border-2 border-white/15 bg-white/5 text-text-primary font-inter font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-50">
                    Cancel
                </button>
            </div>
        </Card>
    </Overlay>
);

export default DeleteConfirmModal;
