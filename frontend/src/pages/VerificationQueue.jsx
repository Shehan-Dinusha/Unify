
import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Search, Clock, FileText, Image as ImageIcon } from 'lucide-react';

const VerificationQueue = () => {
  // Mock Data
  const mockRequests = [
    {
      id: 1,
      name: "Robotics Club",
      type: "Club",
      time: "2 hrs ago",
      avatar: "https://placehold.co/48x48",
      file: "budget_proposal_final.pdf",
      fileSize: "2.4 MB",
      fileType: "pdf",
      status: "pending"
    },
    {
      id: 2,
      name: "John Doe",
      type: "Batch Rep",
      time: "5 hrs ago",
      avatar: "https://placehold.co/48x48",
      file: "event_details_v2.docx",
      fileSize: "450 KB",
      fileType: "doc",
      status: "pending"
    },
    {
      id: 3,
      name: "Debate Society",
      type: "Club",
      time: "1 day ago",
      avatar: "https://placehold.co/48x48",
      file: "speaker_profile_pic.jpg",
      fileSize: "1.2 MB",
      fileType: "image",
      status: "pending"
    }
  ];

  const headerActions = (
    <div className="flex bg-white/5 p-1 rounded-2xl border border-primary-blue/20">
      <button className="flex items-center gap-2 px-6 py-2 bg-primary-blue/20 text-white rounded-xl border border-primary-blue/50 transition-all">
        <div className="w-4 h-4 rounded bg-white" /> {/* Placeholder icon */}
        <span className="text-sm font-bold font-inter">Requests</span>
      </button>
      <button className="flex items-center gap-2 px-6 py-2 text-text-secondary hover:text-white transition-all">
         <div className="w-4 h-4 rounded border border-current" /> {/* Placeholder icon */}
        <span className="text-sm font-bold font-inter">Verified</span>
      </button>
    </div>
  );

  return (
    <MainLayout
      user={{ name: "Alex Johnson", role: "admin" }}
      pageTitle="Verification Queue"
      headerRight={headerActions}
    >
      <div className="flex flex-col gap-8 w-full max-w-[1122px]">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Pending */}
          <Card variant="container" className="h-40 relative group hover:bg-white/10 transition-colors">
             <div className="absolute top-6 left-6 w-10 h-10 bg-yellow-900/30 rounded-lg flex items-center justify-center text-yellow-400">
                <Clock size={20} />
             </div>
             <div className="absolute top-20 left-6">
                <p className="text-sm font-bold text-white">Total Pending</p>
             </div>
             <div className="absolute top-[100px] left-6 flex items-end gap-2">
                <span className="text-3xl font-bold text-white">14</span>
                <span className="text-sm font-bold text-state-success pb-1">+2 new</span>
             </div>
          </Card>

          {/* Approved Today */}
          <Card variant="container" className="h-40 relative group hover:bg-white/10 transition-colors">
             <div className="absolute top-6 left-6 w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400">
                <div className="w-5 h-5 bg-current rounded-sm" /> {/* Placeholder/Simple Icon */}
             </div>
             <div className="absolute top-20 left-6">
                <p className="text-sm font-bold text-white">Approved Today</p>
             </div>
             <div className="absolute top-[100px] left-6">
                <span className="text-3xl font-bold text-white">5</span>
             </div>
          </Card>

          {/* Rejected Today */}
          <Card variant="container" className="h-40 relative group hover:bg-white/10 transition-colors">
             <div className="absolute top-6 left-6 w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center text-red-400">
                 <div className="w-5 h-5 bg-current rounded-sm" /> 
             </div>
             <div className="absolute top-20 left-6">
                <p className="text-sm font-bold text-white">Rejected Today</p>
             </div>
             <div className="absolute top-[100px] left-6">
                <span className="text-3xl font-bold text-white">2</span>
             </div>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card variant="container" className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name, ID or entity..." 
                    className="w-full h-10 pl-10 pr-4 bg-dark-4 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary-blue transition-colors"
                />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <Button size="small" variant="primary" className="h-9">All Requests</Button>
                <Button size="small" variant="secondary" className="h-9 bg-dark-4 text-slate-300">Clubs</Button>
                <Button size="small" variant="secondary" className="h-9 bg-dark-4 text-slate-300">Batch Reps</Button>
            </div>
        </Card>

        {/* Request List */}
        <div className="flex flex-col gap-5">
            {mockRequests.map((req) => (
                <Card key={req.id} variant="container" className="p-0 overflow-hidden">
                    <div className="flex flex-col md:flex-row h-full">
                        {/* Summary Section */}
                        <div className="w-full md:w-96 p-5 border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full border border-slate-700" />
                                    <div>
                                        <h3 className="text-base font-bold text-white">{req.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold font-inter ${
                                                req.type === 'Club' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-purple-900/30 text-purple-300'
                                            }`}>
                                                {req.type}
                                            </span>
                                            <span className="text-slate-400 text-xs font-normal">• {req.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-1.5 bg-yellow-900/30 rounded-full">
                                   <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
                                </div>
                            </div>

                            {/* File Preview */}
                            <div className="mt-6 p-3 bg-dark-4 rounded-lg border border-slate-700 flex items-center gap-3">
                                <div className={`w-10 h-10 rounded flex items-center justify-center ${
                                    req.fileType === 'pdf' ? 'bg-red-900/20 text-red-400' : 
                                    req.fileType === 'doc' ? 'bg-blue-900/20 text-blue-400' : 'bg-orange-900/20 text-orange-400'
                                }`}>
                                   {req.fileType === 'pdf' && <FileText size={20} />}
                                   {req.fileType === 'doc' && <FileText size={20} />}
                                   {req.fileType === 'image' && <ImageIcon size={20} />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-white text-sm truncate">{req.file}</p>
                                    <p className="text-slate-400 text-xs">{req.fileSize}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 pt-4 border-t border-slate-700 flex gap-3">
                                <Button variant="dangerOutline" className="flex-1 h-12 bg-red-400/5 text-red-400 border-red-400 hover:bg-red-400/10">Reject</Button>
                                <Button variant="primary" className="flex-1 h-12 shadow-custom">Verify</Button>
                            </div>
                        </div>

                        {/* Details/Preview Placeholder (Right side of card in design seems empty/hidden or implied content area) */}
                        {/* Based on the design image, the cards are actually width 96 (384px) and stacked vertically? 
                            Wait, the design image shows a layout where:
                            - There is a row of Stats
                            - A search bar
                            - Then a vertical list of Request Cards.
                            Each Request Card looks like it has width 96 (w-96). 
                            But the container is w-[1122px]. 
                            Ah, in the design HTML, the user put `w-96` inside `flex flex-col gap-6`. 
                            It seems they want the cards to be wide or maybe they ARE just narrow w-96 cards?
                            
                            Re-reading the design snippet:
                            <div className="w-[1122px] ... flex flex-col ... gap-6">
                                <div ... gap-5>
                                    <div className="w-96 h-64 ..."> ... </div>
                                </div>
                            </div>
                            
                            It looks like a vertical list of cards. I will make them match the width of the container (full width) 
                            or keep them restricted if that's the desired design. 
                            However, usually in a dashboard list, you want full width. 
                            The user code has `w-96` hardcoded on the cards. 
                            But the container is `w-[1122px]`.
                            
                            I will make the cards responsive/full width of their container to look better, 
                            copying the internal structure. 
                            Actually, looking at the code again:
                            The user has a `flex-row` of stats, then a search bar, then a `flex-col` of cards.
                            The cards are defined as `w-96`. 
                            If I make them full width they will look better. 
                            I will stick to the design's *content* but allow `w-full` for the card container so it fills the layout.
                         */}
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default VerificationQueue;
