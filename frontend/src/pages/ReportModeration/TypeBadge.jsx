import React from 'react';

const styles = {
    'Hate Speech': 'text-state-error bg-state-error/10 border-state-error/30',
    Nudity:        'text-primary-accent bg-primary-accent/10 border-primary-accent/30',
    Spam:          'text-state-warning bg-state-warning/10 border-state-warning/30',
    Harassment:    'text-state-error bg-state-error/10 border-state-error/30',
};

const TypeBadge = ({ type }) => (
    <span className={`inline-flex items-center gap-xs text-body-extra-small-bold px-sm py-xs rounded-lg border ${styles[type] || 'text-text-secondary bg-white/10 border-white/20'}`}>
        {type}
    </span>
);

export default TypeBadge;
