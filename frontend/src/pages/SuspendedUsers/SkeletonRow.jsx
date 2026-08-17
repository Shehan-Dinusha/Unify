const COLS = "2fr 1.2fr 1fr 1fr";

const SkeletonRow = () => (
  <div className="grid gap-md px-lg py-md items-center border-b border-white/5 animate-pulse" style={{ gridTemplateColumns: COLS }}>
    <div className="flex items-center gap-md">
      <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded w-2/3" />
      <div className="h-3 bg-white/5 rounded w-1/3" />
    </div>
    <div><div className="h-6 bg-white/10 rounded-lg w-24" /></div>
    <div className="flex justify-end"><div className="h-8 bg-white/10 rounded-lg w-24" /></div>
  </div>
);

export default SkeletonRow;
