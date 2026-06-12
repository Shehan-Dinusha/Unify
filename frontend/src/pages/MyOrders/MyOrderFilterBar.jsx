import React from "react";
import { Package, Ticket } from "lucide-react";

const MyOrderFilterBar = ({ viewType, setViewType, tabs, activeTab, setActiveTab }) => (
  <div className="flex flex-col md:flex-row justify-between items-center mb-xl gap-4">
    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm w-full md:w-auto">
      {["Marketplace", "Events"].map((type) => (
        <button key={type} onClick={() => setViewType(type)}
          className={`flex-1 md:flex-none px-lg py-sm rounded-xl text-body-small-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            viewType === type
              ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20"
              : "text-text-tertiary hover:text-text-secondary"
          }`}>
          {type === "Marketplace" ? <Package size={16} /> : <Ticket size={16} />}
          {type}
        </button>
      ))}
    </div>

    <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm w-full md:w-auto">
      {tabs.map((tab) => (
        <button key={tab} onClick={() => setActiveTab(tab)}
          className={`flex-1 md:flex-none px-lg py-sm rounded-xl text-body-small-bold transition-all duration-300 ${
            activeTab === tab
              ? "bg-white/10 text-text-primary shadow-lg"
              : "text-text-tertiary hover:text-text-secondary"
          }`}>
          {tab}
        </button>
      ))}
    </div>
  </div>
);

export default MyOrderFilterBar;
