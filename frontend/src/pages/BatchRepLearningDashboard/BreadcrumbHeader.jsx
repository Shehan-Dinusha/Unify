import { BookIcon } from "../../components/common/Icons";

const BreadcrumbHeader = ({ facultyName, degreeName }) => (
  <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold font-inter leading-5 w-full mb-6 mt-2 pl-1">
    <BookIcon className="text-gray-400" />
    <span>{facultyName}</span>
    <span className="font-normal mx-0.5">/</span>
    <span>{degreeName}</span>
  </div>
);

export default BreadcrumbHeader;
