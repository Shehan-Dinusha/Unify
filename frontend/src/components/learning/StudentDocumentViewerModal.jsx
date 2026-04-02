import React, { useEffect } from "react";
import { X, FileText, Download, ZoomIn, ZoomOut, Minus, Plus } from "lucide-react";

/**
 * Full-screen PDF/Document viewer modal mimicking the provided design
 */
const StudentDocumentViewerModal = ({ isOpen, onClose, file }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-full h-full bg-gradient-to-b from-gray-900 to-slate-800 overflow-hidden flex justify-center items-center backdrop-blur-md">
      {/* Background decorations */}
      <div className="w-96 h-96 left-0 top-0 absolute bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="w-96 h-96 right-0 bottom-0 absolute bg-purple-800/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-[90%] max-w-4xl h-[85vh] relative z-10 bg-white/5 rounded-3xl shadow-2xl outline outline-1 outline-offset-[-1px] outline-white/20 flex flex-col backdrop-blur-sm">
        
        {/* Header toolbar */}
        <div className="w-full px-6 py-4 bg-gray-800 rounded-tl-3xl rounded-tr-3xl border-b border-blue-500/20 flex justify-between items-center shrink-0">
            <div className="flex justify-start items-center gap-4">
                <div className="w-10 h-10 bg-red-900/20 rounded-lg flex justify-center items-center">
                    <FileText size={20} className="text-red-400" />
                </div>
                <div className="flex flex-col justify-start items-start">
                    <div className="flex flex-col justify-start items-start">
                        <div className="justify-center text-white text-base font-bold font-inter leading-5 w-60 truncate">
                          {file?.name || "Club_Constitution.pdf"}
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start">
                        <div className="w-60 justify-center text-slate-400 text-sm font-normal font-inter leading-5">
                          {file?.size ? `${file.size} • ` : "2.4 MB • "}
                          {file?.dateModified ? `Uploaded ${file.dateModified}` : "Uploaded Oct 12"}
                        </div>
                    </div>
                </div>
            </div>
            <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex justify-center items-center hover:bg-white/10 transition-colors"
            >
                <X size={20} className="text-gray-400 hover:text-white" />
            </button>
        </div>

        {/* Document Viewer Area */}
        <div className="w-full flex-1 p-4 sm:p-8 bg-gray-800 flex justify-center items-start overflow-y-auto no-scrollbar">
            {/* The Document Page */}
            <div className="w-full max-w-3xl min-h-[600px] p-8 sm:p-12 bg-white shadow-lg flex flex-col justify-start items-start gap-8 shrink-0">
                <div className="self-stretch pb-6 border-b-2 border-slate-200 flex justify-between items-end">
                    <div className="flex flex-col justify-start items-start gap-2">
                        <div className="flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-900 text-3xl font-bold font-lexend leading-9">
                              {file?.name?.replace(".pdf", "") || "Annual Budget Proposal"}
                            </div>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-500 text-base font-normal font-lexend leading-6">Fiscal Year 2024</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start">
                        <div className="flex flex-col justify-start items-end">
                            <div className="text-right justify-center text-blue-600 text-2xl font-bold font-lexend leading-8">ROBOTICS CLUB</div>
                        </div>
                        <div className="flex flex-col justify-start items-end">
                            <div className="text-right justify-center text-slate-500 text-sm font-normal font-lexend leading-5">University Tech Society</div>
                        </div>
                    </div>
                </div>
                
                {/* Mocked Document Body */}
                <div className="self-stretch flex flex-col justify-start items-start gap-6">
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch pb-1 border-b border-slate-100 flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-700 text-lg font-bold font-lexend uppercase leading-7 tracking-wide">1. Executive Summary</div>
                        </div>
                        <div className="flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-600 text-base font-normal font-lexend leading-6">The Robotics Club aims to participate in three major national competitions this year.</div>
                            <div className="justify-center text-slate-600 text-base font-normal font-lexend leading-6">To achieve this, we require funding for new hardware components, travel expenses,</div>
                            <div className="justify-center text-slate-600 text-base font-normal font-lexend leading-6">and workshop materials. This proposal outlines the estimated costs and expected</div>
                            <div className="justify-center text-slate-600 text-base font-normal font-lexend leading-6">outcomes for the upcoming academic year.</div>
                        </div>
                    </div>
                    
                    <div className="self-stretch flex flex-col justify-start items-start gap-3">
                        <div className="self-stretch pb-1 border-b border-slate-100 flex flex-col justify-start items-start">
                            <div className="justify-center text-slate-700 text-lg font-bold font-lexend uppercase leading-7 tracking-wide">2. Itemized Budget Breakdown</div>
                        </div>
                        
                        <div className="w-full flex flex-col">
                            {/* Table Header */}
                            <div className="w-full bg-slate-50 border-b border-slate-200 flex flex-row justify-between items-center py-2 px-3">
                                <div className="flex-1 min-w-[200px] text-slate-600 text-sm font-bold font-lexend leading-5">Item Description</div>
                                <div className="w-24 text-right text-slate-600 text-sm font-bold font-lexend leading-5">Quantity</div>
                                <div className="w-28 text-right text-slate-600 text-sm font-bold font-lexend leading-5">Unit Cost</div>
                                <div className="w-32 text-right text-slate-600 text-sm font-bold font-lexend leading-5">Total</div>
                            </div>
                            
                            {/* Table Rows Wrapper */}
                            <div className="w-full flex flex-col">
                              {/* Row 1 */}
                              <div className="w-full flex justify-between items-center py-2 px-3">
                                  <div className="flex-1 min-w-[200px] text-slate-700 text-sm font-normal font-lexend leading-5">Arduino Mega 2560 Boards</div>
                                  <div className="w-24 text-right text-slate-700 text-sm font-normal font-lexend leading-5">10</div>
                                  <div className="w-28 text-right text-slate-700 text-sm font-normal font-lexend leading-5">$45.00</div>
                                  <div className="w-32 text-right text-slate-700 text-sm font-medium font-lexend leading-5">$450.00</div>
                              </div>
                              {/* Row 2 */}
                              <div className="w-full border-t border-slate-100 flex justify-between items-center py-2 px-3">
                                  <div className="flex-1 min-w-[200px] text-slate-700 text-sm font-normal font-lexend leading-5">High-Torque Servo Motors</div>
                                  <div className="w-24 text-right text-slate-700 text-sm font-normal font-lexend leading-5">20</div>
                                  <div className="w-28 text-right text-slate-700 text-sm font-normal font-lexend leading-5">$22.50</div>
                                  <div className="w-32 text-right text-slate-700 text-sm font-medium font-lexend leading-5">$450.00</div>
                              </div>
                              {/* Row 3 */}
                              <div className="w-full border-t border-slate-100 flex justify-between items-center py-2 px-3">
                                  <div className="flex-1 min-w-[200px] text-slate-700 text-sm font-normal font-lexend leading-5">LiPo Batteries (3S 2200mAh)</div>
                                  <div className="w-24 text-right text-slate-700 text-sm font-normal font-lexend leading-5">15</div>
                                  <div className="w-28 text-right text-slate-700 text-sm font-normal font-lexend leading-5">$30.00</div>
                                  <div className="w-32 text-right text-slate-700 text-sm font-medium font-lexend leading-5">$450.00</div>
                              </div>
                              {/* Row 4 */}
                              <div className="w-full border-t border-slate-100 flex justify-between items-center py-2 px-3">
                                  <div className="flex-1 min-w-[200px] text-slate-700 text-sm font-normal font-lexend leading-5">Competition Registration Fees</div>
                                  <div className="w-24 text-right text-slate-700 text-sm font-normal font-lexend leading-5">3</div>
                                  <div className="w-28 text-right text-slate-700 text-sm font-normal font-lexend leading-5">$200.00</div>
                                  <div className="w-32 text-right text-slate-700 text-sm font-medium font-lexend leading-5">$600.00</div>
                              </div>
                            </div>
                            
                            {/* Table Footer */}
                            <div className="w-full mt-4 flex justify-between items-center py-4 px-3 border-t-2 border-slate-200">
                                <div className="text-slate-900 text-sm font-bold font-lexend leading-5">Grand Total</div>
                                <div className="text-blue-600 text-lg font-bold font-lexend leading-7">$1,950.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer controls */}
        <div className="w-full h-20 px-6 py-4 bg-gray-800 rounded-bl-3xl rounded-br-3xl border-t border-slate-700 flex justify-center items-center shrink-0">
            <div className="flex justify-start items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors flex justify-center items-center">
                    <Minus size={20} className="text-gray-400" />
                </button>
                <div className="text-gray-400 text-sm font-bold font-inter leading-5">100%</div>
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors flex justify-center items-center">
                    <Plus size={20} className="text-gray-400" />
                </button>
                <div className="w-px h-6 bg-slate-700 mx-2" />
                <button className="p-2 rounded-lg hover:bg-white/10 transition-colors flex justify-center items-center">
                    <Download size={20} className="text-gray-400 hover:text-white" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDocumentViewerModal;
