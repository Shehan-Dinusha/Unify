import StatsCard from "../../components/common/StatsCard";

const StatsTileGrid = ({ tiles, onNavigate }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
    {tiles.map((tile, i) => (
      <div
        key={i}
        className="cursor-pointer hover:scale-[1.02] transition-transform"
        onClick={() => onNavigate(tile.path)}
      >
        <StatsCard
          iconSrc={tile.iconSrc}
          iconAlt={tile.iconAlt}
          iconBgClass={tile.iconBgClass}
          title={tile.title}
          value={tile.value}
          subValue={tile.subValue}
          subValueClass={tile.subValueClass}
        />
      </div>
    ))}
  </div>
);

export default StatsTileGrid;
