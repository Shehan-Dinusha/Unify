import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import VerifiedEntityCard from './VerifiedEntityCard';
import { mockVerified } from '../../data/mockData';

const VerifiedList = () => {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredVerified = mockVerified.filter(item => {
        const matchesFilter = filter === 'All' || item.type === filter;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const categories = ['All', 'Club', 'Batch Rep'];

    // Stats calculations
    const totalVerified = mockVerified.length;
    const verifiedClubs = mockVerified.filter(i => i.type === 'Club').length;
    const verifiedReps = mockVerified.filter(i => i.type === 'Batch Rep').length;

    const handleRemoveVerification = (entity) => {
        console.log("Remove verification for:", entity.name);
        // Implement modal logic here later or pass up
    };

    return (
        <div className="flex flex-col gap-xl w-full max-w-[1122px]">
             {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                {/* Verified Clubs */}
                <Card variant="container" className="h-40 relative group transition-colors">
                    <div className="absolute top-lg left-lg w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                         <img src="/icon_verified_clubs.svg" alt="Verified Clubs" className="w-6 h-6" />
                    </div>
                    <div className="absolute top-[80px] left-lg">
                        <p className="text-body-small-bold text-text-secondary">Verified Clubs</p>
                    </div>
                    <div className="absolute top-[100px] left-lg flex items-end gap-sm">
                        <span className="text-heading-medium text-text-primary">{verifiedClubs}</span>
                        <span className="text-body-small-bold text-state-success pb-xs">+3 new</span>
                    </div>
                </Card>

                {/* Batch Reps */}
                <Card variant="container" className="h-40 relative group transition-colors">
                    <div className="absolute top-lg left-lg w-10 h-10 bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <img src="/icon_batch_rep.svg" alt="Batch Reps" className="w-6 h-6" />
                    </div>
                    <div className="absolute top-[80px] left-lg">
                        <p className="text-body-small-bold text-text-secondary">Batch Reps</p>
                    </div>
                    <div className="absolute top-[100px] left-lg flex items-end gap-sm">
                        <span className="text-heading-medium text-text-primary">{verifiedReps}</span>
                        <span className="text-body-small-bold text-state-success pb-xs">+1 new</span>
                    </div>
                </Card>

                {/* Total Verified */}
                <Card variant="container" className="h-40 relative group transition-colors">
                    <div className="absolute top-lg left-lg w-10 h-10 bg-blue-500/5 rounded-lg flex items-center justify-center">
                        <img src="/icon_verified_badge.svg" alt="Total Verified" className="w-6 h-6" />
                    </div>
                    <div className="absolute top-[80px] left-lg">
                        <p className="text-body-small-bold text-text-secondary">Total Verified</p>
                    </div>
                    <div className="absolute top-[100px] left-lg">
                        <span className="text-heading-medium text-text-primary">{totalVerified}</span>
                    </div>
                </Card>
            </div>

            {/* Filter Bar */}
            <Card variant="container" className="">
                <div className="flex flex-col md:flex-row justify-between items-center gap-md">
                    {/* Search */}
                    <div className="relative w-full md:w-96 pl-2">
                        <img src="/icon_search.svg" alt="Search" className="absolute left-6 top-1/2 -translate-y-1/2 w-[18px] h-[18px] opacity-50" />
                        <input 
                            type="text" 
                            placeholder="Search by name, ID or entity..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-md bg-dark-4 border border-white/10 rounded-lg text-body-small text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-blue transition-colors"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-sm w-full md:w-auto overflow-x-auto pb-xs md:pb-0 pr-2">
                        <Button 
                            size="small" 
                            variant={filter === 'All' ? 'primary' : 'secondary'} 
                            className={`h-9 whitespace-nowrap ${filter !== 'All' ? 'bg-dark-4 text-text-secondary border border-white/10' : ''}`}
                            onClick={() => setFilter('All')}
                        >
                            All Verified
                        </Button>
                        <Button 
                            size="small" 
                            variant={filter === 'Club' ? 'primary' : 'secondary'} 
                            className={`h-9 whitespace-nowrap ${filter !== 'Club' ? 'bg-dark-4 text-text-secondary border border-white/10' : ''}`}
                            onClick={() => setFilter('Club')}
                        >
                            Clubs
                        </Button>
                        <Button 
                            size="small" 
                            variant={filter === 'Batch Rep' ? 'primary' : 'secondary'} 
                            className={`h-9 whitespace-nowrap ${filter !== 'Batch Rep' ? 'bg-dark-4 text-text-secondary border border-white/10' : ''}`}
                            onClick={() => setFilter('Batch Rep')}
                        >
                            Batch Reps
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Verified List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg gap-y-6 content-start">
                {filteredVerified.map((entity) => (
                    <div key={entity.id} className="h-72">
                         <VerifiedEntityCard entity={entity} onRemoveVerification={handleRemoveVerification} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VerifiedList;
