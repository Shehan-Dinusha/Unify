import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../../common/Card";
import { getPublicFollowers } from "../../../services/followerService";

const FollowersListModal = ({ userId, type = "followers", onClose }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const title = type === "followers" ? "Followers" : "Following";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicFollowers(userId);
        setUsers(data.followers || []);
      } catch (err) {
        setError(err.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUsers();
    }
  }, [userId, type]);

  const handleUserClick = (id) => {
    onClose();
    navigate(`/profile/${id}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-md animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-md" onClick={onClose} />

      <Card
        variant="card"
        className="w-full max-w-[400px] max-h-[80vh] flex flex-col !bg-dark-2 !backdrop-blur-none !border-white/10 !shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        padding="p-0"
      >
        <div className="flex items-center justify-between p-lg border-b border-white/5">
          <h2 className="text-heading-small text-text-primary font-bold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-md flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-state-error py-10">{error}</p>
          ) : users.length === 0 ? (
            <p className="text-center text-text-secondary py-10">No {title.toLowerCase()} found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {users.map((u) => (
                <div 
                  key={u.id} 
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => handleUserClick(u.id)}
                >
                  <img
                    src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=2666F1&color=fff`}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-body-small-bold text-text-primary">{u.name}</p>
                    <p className="text-xs text-text-secondary capitalize">{u.role}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default FollowersListModal;
