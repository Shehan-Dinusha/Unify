import React, { useState, useEffect } from "react";
import { X, Loader2, Star } from "lucide-react";
import Card from "../../common/Card";
import { getTargetReviews } from "../../../services/reviewService";

const ReviewsListModal = ({ targetId, onClose }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTargetReviews(targetId);
        // getTargetReviews returns { reviews, summary }
        setReviews(data.reviews || []);
      } catch (err) {
        setError(err.message || "Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (targetId) {
      fetchReviews();
    }
  }, [targetId]);

  const renderStars = (rating) => {
    const stars = Array.from({ length: 5 }, (_, i) => i + 1);
    return (
      <div className="flex items-center gap-0.5">
        {stars.map((s) => (
          <Star
            key={s}
            size={14}
            className={
              s <= Math.round(rating)
                ? "text-state-warning fill-state-warning"
                : "text-text-tertiary opacity-40"
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-md animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-dark-1/80 backdrop-blur-md" onClick={onClose} />

      <Card
        variant="card"
        className="w-full max-w-[1200px] h-[90vh] flex flex-col !bg-dark-2 !backdrop-blur-none !border-white/10 !shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        padding="p-0"
      >
        <div className="flex items-center justify-between p-lg border-b border-white/5 shrink-0">
          <h2 className="text-heading-small text-text-primary font-bold">
            Reviews
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-md flex-1 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto w-full">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
              </div>
            ) : error ? (
              <p className="text-center text-state-error py-10">{error}</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-text-secondary py-10">No reviews found.</p>
            ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((r) => (
                <Card key={r.id} variant="container" padding="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.author?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author?.name || "U")}&background=2666F1&color=fff`}
                        alt={r.author?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <p className="text-body-small-bold text-text-primary">
                          {r.author?.name || "Unknown"}
                        </p>
                        <span className="text-[11px] text-text-tertiary mt-0.5">
                          • {r.createdAt}
                        </span>
                      </div>
                    </div>
                    <div className="pt-1">
                      {renderStars(r.rating)}
                    </div>
                  </div>
                  {r.content && (
                    <p className="text-body-small text-text-secondary mt-1">
                      {r.content}
                    </p>
                  )}
                  {r.ownerReply && (
                    <div className="mt-3">
                      <div className="p-3 bg-primary-blue/10 rounded-lg border border-primary-blue/20">
                        <p className="text-[11px] font-bold text-primary-blue mb-1">Owner's Reply:</p>
                        <p className="text-[12px] text-text-secondary">{r.ownerReply}</p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReviewsListModal;
