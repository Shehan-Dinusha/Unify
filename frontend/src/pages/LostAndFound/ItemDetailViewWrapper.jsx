import { useState, useEffect } from "react";
import { getItemById, getItemMatches } from "../../services/lostAndFoundService";
import ItemDetailView from "./ItemDetailView";

const ItemDetailViewWrapper = ({ id, onBack, onSelectMatch }) => {
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getItemById(id);
        setItem(data);
        const matchData = await getItemMatches(id).catch(() => null);
        setMatches(matchData?.matches || null);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  if (loading) return <div className="text-center text-text-secondary py-10">Loading item...</div>;
  if (!item) return (
    <div className="text-center text-text-secondary py-10">
      Item not found. <button onClick={onBack} className="text-primary-blue hover:underline">Go back</button>
    </div>
  );

  return <ItemDetailView item={item} matches={matches} onSelectMatch={onSelectMatch} />;
};

export default ItemDetailViewWrapper;
