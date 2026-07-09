import React from 'react';
import Card from '../../components/common/Card';
import { Clock, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';

const ConfigurationLogs = ({ logs, loading }) => (
    <Card variant="card" padding="p-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-sm mb-lg">
            <div className="flex items-center gap-sm">
                <Clock size={20} className="text-text-secondary" />
                <h3 className="text-body-large-bold text-text-primary font-inter">Recent Configuration Changes</h3>
            </div>
            <button className="text-body-small-bold text-primary-blue font-inter hover:underline transition-all hidden md:block">
                View All Logs
            </button>
        </div>
        {logs.length === 0 && !loading && (
            <p className="text-body-small text-text-secondary font-inter py-md text-center">No configuration changes recorded yet.</p>
        )}
        <div className="flex flex-col">
            {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-md py-md border-b border-white/5 last:border-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${log.type === 'package_added' ? 'bg-state-success/15' : log.type === 'package_deleted' ? 'bg-state-error/15' : 'bg-primary-blue/15'}`}>
                        {log.type === 'package_added' && <CheckCircle2 size={18} className="text-state-success" />}
                        {log.type === 'package_deleted' && <Trash2 size={18} className="text-state-error" />}
                        {log.type === 'package_updated' && <RefreshCw size={18} className="text-primary-blue" />}
                        {!['package_added', 'package_deleted', 'package_updated'].includes(log.type) && <Clock size={18} className="text-text-secondary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-sm">
                            <p className="text-body-small-bold text-text-primary font-inter leading-tight">{log.title}</p>
                            <span className="text-body-extra-small text-text-secondary font-inter whitespace-nowrap shrink-0 hidden md:inline">{log.time}</span>
                        </div>
                        <p className="text-body-extra-small text-text-secondary font-inter mt-0.5">{log.description}</p>
                        <span className="text-body-extra-small text-text-tertiary font-inter mt-1 block md:hidden">{log.time}</span>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

export default ConfigurationLogs;
