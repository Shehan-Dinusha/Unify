import React from "react";
import { ChevronRight, Server } from "lucide-react";

/**
 * Renders the top header for the selected module showing details and access
 */
const StudentModuleHeader = ({
  moduleName = "Programming Fundamentals",
  moduleCode = "CS302",
  semesterName = "Semester 3",
  batchName = "Batch 2024",
  description = "Access all learning materials for IN1101 including lecture slides, recorded sessions, and lab assignments.",
}) => {
  return (
    <div className="self-stretch flex flex-col justify-start items-start gap-2.5 w-full">
      {/* Breadcrumbs */}
      <div className="self-stretch inline-flex justify-start items-start w-full">
        <div className="self-stretch flex flex-wrap justify-start items-center gap-y-1">
          <div className="justify-center text-gray-400 text-xs font-normal font-inter leading-5">
            {batchName}
          </div>
          <div className="pl-2 pt-1 pb-[2.72px] inline-flex flex-col justify-start items-start">
            <ChevronRight size={16} className="text-gray-400" />
          </div>
          <div className="pl-2 inline-flex flex-col justify-start items-start">
            <div className="justify-center text-gray-400 text-xs font-normal font-inter leading-5">
              {semesterName}
            </div>
          </div>
          <div className="pl-2 pt-1 pb-[2.72px] inline-flex flex-col justify-start items-start">
            <ChevronRight size={16} className="text-gray-400" />
          </div>
          <div className="pl-2 inline-flex flex-col justify-start items-start">
            <div className="px-2 py-0.5 bg-white/10 rounded flex flex-col justify-start items-start mt-0.5 sm:mt-0">
              <div className="justify-center text-white text-xs font-normal font-inter leading-5">
                {moduleCode}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="self-stretch pb-5 border-b-[1px] border-white/5 inline-flex justify-between items-end w-full mt-1 sm:mt-0">
        <div className="w-full inline-flex flex-col justify-start items-start gap-2">
          <div className="self-stretch inline-flex justify-start items-center gap-2.5">
            <div className="inline-flex flex-col justify-start items-start">
              <Server size={28} className="text-indigo-500 sm:w-8 sm:h-8" />
            </div>
            <div className="justify-center text-white text-2xl sm:text-3xl font-bold font-inter leading-8 sm:leading-9">
              {moduleName}
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start max-w-[803px]">
            <div className="w-full justify-start text-gray-400 text-sm font-normal font-inter leading-5 break-words">
              {description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModuleHeader;
