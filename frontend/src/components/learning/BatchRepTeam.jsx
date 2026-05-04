import React, { useState, useEffect } from "react";
import * as learningService from "../../services/learningService";

const TeamMemberRow = ({
  name,
  avatarSrc,
  initials,
  degreeText,
  roleText = "Rep",
  isYou = false,
  isLast = false,
}) => (
  <div
    className={`w-full px-5 py-4 flex items-center gap-4 ${
      !isLast ? "border-b border-gray-700" : ""
    }`}
  >
    <div className="shrink-0">
      {avatarSrc ? (
        <img
          src={avatarSrc}
          alt={name}
          className="w-10 h-10 rounded-full border-2 border-gray-600 object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full outline outline-2 outline-gray-600 outline-offset-[-2px] bg-gradient-to-l from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium font-inter">
            {initials}
          </span>
        </div>
      )}
    </div>
    <div className="flex flex-col">
      <h4 className="text-white text-sm font-bold font-inter leading-5">
        {name} {isYou && "(You)"}
      </h4>
      <div className="text-gray-400 text-xs font-inter leading-5">
        <span className="font-bold">{degreeText}</span>
        <span className="font-normal"> {roleText}</span>
      </div>
    </div>
  </div>
);

const BatchRepTeam = ({ degreeId = 18, currentUserId = 1 }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReps = async () => {
      try {
        setIsLoading(true);
        const res = await learningService.getBatchReps(degreeId);
        if (res?.data) {
          // Map backend response to component props
          const mappedReps = res.data.map(rep => ({
            id: rep.id,
            name: `${rep.firstName} ${rep.lastName}`,
            avatarSrc: rep.profilePicture,
            initials: rep.firstName ? rep.firstName[0] + (rep.lastName ? rep.lastName[0] : '') : '??',
            degreeText: `${rep.degree?.name || 'Degree'} B${rep.batchId || ''}`,
            roleText: "Rep",
            isYou: rep.id === currentUserId,
          }));
          setTeamMembers(mappedReps);
        }
      } catch (error) {
        console.error("Failed to fetch batch reps", error);
        // Fallback to empty if fails
        setTeamMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReps();
  }, [degreeId]);

  return (
    <div className="w-full bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 flex flex-col overflow-hidden">
      <div className="w-full px-5 py-4 border-b border-slate-700 flex flex-col gap-1 tracking-tight">
        <h3 className="text-white text-base font-bold font-inter leading-5">
          Batch Rep Team & Access
        </h3>
        <p className="text-gray-400 text-xs font-normal font-inter leading-5">
          Batch Reps from the same faculty or degree who can contribute to this
          dashboard.
        </p>
      </div>

      <div className="flex flex-col w-full">
        {isLoading ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            Loading batch reps...
          </div>
        ) : teamMembers.length > 0 ? (
          teamMembers.map((member, idx) => (
            <TeamMemberRow
              key={member.id || idx}
              {...member}
              isLast={idx === teamMembers.length - 1}
            />
          ))
        ) : (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">
            No batch reps found.
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchRepTeam;
