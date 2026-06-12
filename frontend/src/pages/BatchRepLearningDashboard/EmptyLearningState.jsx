import { BookIcon } from "../../components/common/Icons";

const EmptyLearningState = ({ hasModules }) => (
  <div className="w-full p-10 flex flex-col items-center justify-center bg-slate-800 rounded-xl shadow-sm outline outline-1 outline-slate-700 text-gray-400">
    <BookIcon className="mb-4 opacity-50 w-12 h-12" />
    <p>
      {hasModules
        ? "Select a module from the sidebar to view details"
        : "Create a module first to start uploading materials"}
    </p>
  </div>
);

export default EmptyLearningState;
