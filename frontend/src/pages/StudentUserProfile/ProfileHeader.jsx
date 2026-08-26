import { FileText, MessageSquare, Star, Flag, AlertTriangle } from "lucide-react";
import Card from "../../components/common/Card";

const ProfileHeader = ({ user, statsArray }) => {
  const StatIcon = { totalPosts: FileText, comments: MessageSquare, reputation: Star, reports: Flag };

  return (
    <>
      <Card variant="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-lg">
          <div className="relative shrink-0"><div className="w-[88px] h-[88px] rounded-full p-[3px] bg-gradient-to-br from-primary-blue via-primary-accent to-primary-blue"><img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-dark-1" /></div>{user.isOnline && <span className="absolute bottom-1 left-2 w-3.5 h-3.5 rounded-full bg-state-success border-2 border-dark-1" />}</div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-sm mb-xs">
              <h2 className="text-heading-small text-text-primary font-inter">{user.name}</h2>
              <span className={`px-sm py-xs rounded-lg text-body-extra-small-bold border ${user.status === 'Suspended' ? 'bg-state-error/15 text-state-error border-state-error/30' : 'bg-state-success/15 text-state-success border-state-success/30'}`}>
                {user.status}
              </span>
              {user.tier === 'Premium' && <span className="px-sm py-xs rounded-lg text-body-extra-small-bold bg-primary-blue/15 text-primary-blue border border-primary-blue/30">Premium</span>}
            </div>
            <div className="flex flex-wrap items-center gap-md text-body-extra-small text-text-secondary font-inter"><span className="flex items-center gap-xs">✉ {user.email}</span><span className="flex items-center gap-xs">⊙ ID: {user.userId}</span><span className="flex items-center gap-xs">📅 {user.joinDate}</span></div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        {statsArray.map((stat) => {
          const SIcon = StatIcon[stat.key];
          return (
            <Card key={stat.key} variant="container" className="relative overflow-visible hover:border-primary-blue/30 transition-colors">
              <div className="flex items-start justify-between mb-sm"><p className="text-body-small text-text-secondary font-inter">{stat.label}</p>{SIcon && <SIcon size={18} className="text-text-secondary opacity-60" />}</div>
              <p className={`text-heading-medium font-inter ${stat.key === 'reports' && stat.isWarning ? 'text-state-error' : 'text-text-primary'}`}>{stat.value}</p>
              {stat.trend && (
                <p className={`text-body-extra-small font-inter mt-xs ${stat.isWarning ? 'text-state-error' : 'text-state-success'}`}>
                  {stat.isWarning ? '' : '↗ '}{stat.trend}
                </p>
              )}
              {stat.key === 'reports' && <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none"><AlertTriangle size={72} className="text-state-warning" /></div>}
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default ProfileHeader;
