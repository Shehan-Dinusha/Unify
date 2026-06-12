import React from 'react';
import { Search } from 'lucide-react';
import Card from '../../components/common/Card';

const InteractionsTable = ({ interactions, searchQuery, setSearchQuery }) => (
  <Card variant="card" padding="p-lg">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-sm mb-lg">
      <h3 className="text-body-large-bold text-text-primary font-inter">Top Interactions</h3>
      <div className="relative w-full sm:w-64">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search Comment or Users"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-sm text-text-primary placeholder:text-text-tertiary outline-none font-inter focus:border-primary-blue/50 focus:bg-white/10 transition-all"
        />
      </div>
    </div>

    <div className="hidden md:grid grid-cols-12 gap-md px-md py-sm border-b border-white/10 mb-sm">
      <span className="col-span-3 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">User</span>
      <span className="col-span-2 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">Action</span>
      <span className="col-span-3 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">Content</span>
      <span className="col-span-2 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">Date</span>
      <span className="col-span-2 text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider text-right">Impact</span>
    </div>

    <div className="flex flex-col">
      {interactions.map((interaction) => (
        <div
          key={interaction.id}
          className="grid grid-cols-1 md:grid-cols-12 gap-sm md:gap-md items-center px-md py-md border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors rounded-lg"
        >
          <div className="md:col-span-3 flex items-center gap-sm">
            <img
              src={interaction.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(interaction.user || 'U')}&background=2666F1&color=fff`}
              alt={interaction.user}
              className="w-8 h-8 rounded-full border border-white/15 flex-shrink-0"
            />
            <span className="text-body-small-bold text-text-primary font-inter">{interaction.user}</span>
          </div>
          <div className="md:col-span-2">
            <span className={`inline-block text-body-extra-small-bold font-inter px-2.5 py-0.5 rounded-full ${interaction.actionColor || 'bg-white/10 text-text-secondary'}`}>
              {interaction.action}
            </span>
          </div>
          <div className="md:col-span-3">
            <span className="text-body-small text-text-secondary font-inter">{interaction.content}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-body-extra-small text-text-secondary font-inter">{interaction.date}</span>
          </div>
          <div className="md:col-span-2 text-right">
            <span className={`text-body-small-bold font-inter ${interaction.impactColor || 'text-text-secondary'}`}>
              {interaction.impact}
            </span>
          </div>
        </div>
      ))}

      {interactions.length === 0 && (
        <div className="text-center py-xl">
          <p className="text-body-small text-text-secondary font-inter">No interactions found.</p>
        </div>
      )}
    </div>
  </Card>
);

export default InteractionsTable;
