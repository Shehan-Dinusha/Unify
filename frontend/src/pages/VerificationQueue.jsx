import MainLayout from '../components/layout/MainLayout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

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
        <img src="/icon_tab_requests.svg" alt="Requests" className="w-4 h-4" />
        <span className="text-sm font-bold font-inter">Requests</span>
      </button>
      <button className="flex items-center gap-2 px-6 py-2 text-text-secondary hover:text-white transition-all">
         <img src="/icon_tab_verified.svg" alt="Verified" className="w-4 h-5" />
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
             <div className="absolute top-6 left-6 w-10 h-10 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <img src="/icon_total_pending.svg" alt="Pending" className="w-6 h-6" />
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
             <div className="absolute top-6 left-6 w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center">
                <img src="/icon_approved_today.svg" alt="Approved" className="w-6 h-6" />
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
             <div className="absolute top-6 left-6 w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center">
                 <img src="/icon_rejected_today.svg" alt="Rejected" className="w-6 h-6" />
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
        <Card variant="container" className="">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <img src="/icon_search.svg" alt="Search" className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] opacity-50" />
                    <input 
                        type="text" 
                        placeholder="Search by name, ID or entity..." 
                        className="w-full h-10 pl-10 pr-4 bg-dark-4 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary-blue transition-colors"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <Button size="small" variant="primary" className="h-9 whitespace-nowrap">All Requests</Button>
                    <Button size="small" variant="secondary" className="h-9 bg-dark-4 text-slate-300 whitespace-nowrap border border-slate-700">Clubs</Button>
                    <Button size="small" variant="secondary" className="h-9 bg-dark-4 text-slate-300 whitespace-nowrap border border-slate-700">Batch Reps</Button>
                </div>
            </div>
        </Card>

        {/* Request List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRequests.map((req) => (
                <Card key={req.id} variant="container" className="h-full">
                    <div className="flex flex-col gap-6 h-full">
                        {/* Header Section */}
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <img src={req.avatar} alt={req.name} className="w-12 h-12 rounded-full border border-slate-700 object-cover" />
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
                            <div className="p-1.5 bg-yellow-900/20 rounded flex items-center justify-center">
                               <img src="/icon_pending.svg" alt="Pending Status" className="w-3 h-3 text-yellow-500" />
                            </div>
                        </div>

                        {/* File Preview */}
                        <div className="p-3 bg-dark-4 rounded-lg border border-slate-700 flex items-center justify-between">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-10 h-10 rounded flex-shrink-0 flex items-center justify-center ${
                                    req.fileType === 'pdf' ? 'bg-red-900/20' : 
                                    req.fileType === 'doc' ? 'bg-blue-900/20' : 'bg-orange-900/20'
                                }`}>
                                   {req.fileType === 'pdf' && <img src="/icon_file_pdf.svg" className="w-5 h-5" />}
                                   {req.fileType === 'doc' && <img src="/icon_docs.svg" className="w-5 h-5" />}
                                   {req.fileType === 'image' && <img src="/icon_image.svg" className="w-5 h-5" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{req.file}</p>
                                    <p className="text-slate-400 text-xs">{req.fileSize}</p>
                                </div>
                            </div>
                            <button className="flex-shrink-0 text-slate-400 hover:text-primary-blue transition-colors">
                                <img src="/icon_view.svg" alt="View" className="w-5 h-5 opacity-50 hover:opacity-100" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <Button variant="dangerOutline" className="h-[42px] border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50">Reject</Button>
                            <Button variant="primary" className="h-[42px] shadow-none bg-primary-blue hover:bg-primary-blue/90">Verify</Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default VerificationQueue;
