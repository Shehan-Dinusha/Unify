import { SlidersHorizontal } from "lucide-react";
import Card from "../../components/common/Card";

const TAB_FILTERS = ['All', 'Logins', 'Posts', 'Comments'];

const ActivityLog = ({ log, activeTab, onTabChange }) => {
  const tabTypeMap = { All: null, Logins: 'login', Posts: 'post', Comments: 'comment' };
  const filteredLog = tabTypeMap[activeTab]
    ? log.filter((e) => e.type === tabTypeMap[activeTab])
    : log || [];

  return (
    <Card variant="container" className="flex-1">
      <div className="flex items-center gap-sm mb-md"><span className="text-lg">📋</span><div><h3 className="text-body-large-bold text-text-primary font-inter">Activity Log</h3><p className="text-body-extra-small text-text-secondary font-inter">Detailed history of user actions and events</p></div></div>
      <div className="flex flex-wrap items-center justify-between gap-md mb-md">
        <div className="flex items-center gap-sm">{TAB_FILTERS.map((tab) => (<button key={tab} onClick={() => onTabChange(tab)} className={`px-md py-xs rounded-xl text-body-small-bold font-inter transition-all ${activeTab === tab ? 'bg-primary-blue text-white' : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary border border-white/10'}`}>{tab}</button>))}</div>
        <button className="flex items-center gap-xs px-md py-xs rounded-xl bg-white/5 border border-white/10 text-body-small text-text-secondary hover:text-text-primary hover:bg-white/10 transition-all font-inter"><SlidersHorizontal size={14} /> Filter</button>
      </div>
      <div className="hidden md:block relative overflow-hidden border border-white/10 rounded-2xl">
        <div className="grid gap-md px-lg py-md border-b border-white/10 bg-white/[0.02]" style={{ gridTemplateColumns: '80px 2fr 1.2fr 1fr' }}><span className="text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">Type</span><span className="text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">Action Detail</span><span className="text-body-extra-small-bold text-text-secondary font-inter uppercase tracking-wider">IP / Device</span><span className="text-body-extra-small-bold text-text-secondary font-inter text-right uppercase tracking-wider">Date</span></div>
        {filteredLog.map((entry, idx) => (<div key={entry.id} className={`grid gap-md px-lg py-md items-center hover:bg-white/5 transition-colors ${idx < filteredLog.length - 1 ? 'border-b border-white/5' : ''}`} style={{ gridTemplateColumns: '80px 2fr 1.2fr 1fr' }}><div className="flex items-center"><span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${entry.typeColor}`}>{entry.typeIcon}</span></div><div className="min-w-0"><p className="text-body-small-bold text-text-primary font-inter">{entry.title}</p><p className="text-body-extra-small text-text-secondary font-inter truncate">{entry.detail}</p></div><div className="min-w-0"><p className="text-body-small text-text-primary font-inter">{entry.ip}</p><p className="text-body-extra-small text-text-secondary font-inter">{entry.device}</p></div><div className="text-right"><p className="text-body-small-bold text-text-primary font-inter">{entry.date}</p><p className="text-body-extra-small text-text-secondary font-inter">{entry.time}</p></div></div>))}
      </div>
    </Card>
  );
};

export default ActivityLog;
