import React from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../../components/common/StatsCard';

const HighlightStats = ({ counts }) => (
    <div className="grid grid-cols-3 gap-lg">
        <Link to="/new-announcements">
            <StatsCard iconSrc="/icon_new_announcement.svg" iconAlt="Announcements" iconBgClass="bg-yellow-500/20" title="New Announcements" value={counts.announcements} />
        </Link>
        <Link to="/marketplace-items">
            <StatsCard iconSrc="/icon_marketplace.svg" iconAlt="Marketplace" iconBgClass="bg-green-500/20" title="New Marketplace Items" value={counts.marketplace} />
        </Link>
        <Link to="/events-today">
            <StatsCard iconSrc="/icon_event_today.svg" iconAlt="Events" iconBgClass="bg-purple-500/20" title="Events Today" iconSize="w-7 h-7" value={counts.events} />
        </Link>
    </div>
);

export default HighlightStats;
