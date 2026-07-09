import React from 'react';
import Card from '../../components/common/Card';
import {
  ShoppingBag, Clock, CheckCircle2, ArrowUp,
} from 'lucide-react';

const StatCard = ({
  label, value, sub, subLabel, subPositive, icon: Icon, iconBg, iconColor, badge, badgeColor,
}) => (
  <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-text-secondary text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
    </div>
    <div className="flex items-center gap-2">
      {sub && (
        <span className={`flex items-center gap-1 text-xs font-bold ${subPositive ? 'text-state-success' : 'text-state-error'}`}>
          <ArrowUp className={`w-3 h-3 ${!subPositive && 'rotate-180'}`} />
          {sub}
        </span>
      )}
      {badge && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
          {badge}
        </span>
      )}
      {subLabel && (
        <span className="text-text-secondary text-xs">{subLabel}</span>
      )}
    </div>
  </Card>
);

const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
    <StatCard
      label="Total Orders"
      value={stats.totalOrders.toLocaleString()}
      sub={`${stats.totalOrdersTrend > 0 ? '+' : ''}${stats.totalOrdersTrend}%`}
      subLabel="vs last week"
      subPositive={stats.totalOrdersTrend >= 0}
      icon={ShoppingBag}
      iconBg="bg-primary-blue/20"
      iconColor="text-primary-blue"
    />
    <StatCard
      label="Pending Fulfillment"
      value={stats.pendingOrders}
      badge={stats.pendingActionCount > 0 ? 'Action Needed' : null}
      badgeColor="bg-state-warning/20 text-state-warning"
      subLabel={`${stats.pendingActionCount} items today`}
      icon={Clock}
      iconBg="bg-state-warning/20"
      iconColor="text-state-warning"
    />
    <StatCard
      label="Completed Orders"
      value={stats.completedOrders.toLocaleString()}
      sub={`${stats.completionRate}%`}
      subLabel="completion rate"
      subPositive={true}
      icon={CheckCircle2}
      iconBg="bg-state-success/20"
      iconColor="text-state-success"
    />
  </div>
);

export default DashboardStats;
