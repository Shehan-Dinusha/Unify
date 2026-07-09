import { useState, useRef, useCallback } from "react";

function computeNextState(state, action) {
  const { feedback, helpfulCount, notHelpfulCount } = state;
  const isHelpful = action === "helpful";

  if (feedback === action) {
    return {
      feedback: null,
      helpfulCount: isHelpful ? Math.max(0, helpfulCount - 1) : helpfulCount,
      notHelpfulCount: isHelpful ? notHelpfulCount : Math.max(0, notHelpfulCount - 1),
    };
  }

  return {
    feedback: action,
    helpfulCount: helpfulCount + (isHelpful ? 1 : feedback === "helpful" ? -1 : 0),
    notHelpfulCount: notHelpfulCount + (isHelpful ? (feedback === "not_helpful" ? -1 : 0) : 1),
  };
}

export default function useOptimisticFeedback(reviewId, initial, onFeedback) {
  const [state, setState] = useState({
    feedback: initial.currentUserFeedback ?? null,
    helpfulCount: initial.helpfulCount ?? 0,
    notHelpfulCount: initial.notHelpfulCount ?? 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const prevRef = useRef(null);

  const handleAction = useCallback(async (action) => {
    if (isUpdating) return;
    prevRef.current = state;
    setIsUpdating(true);

    const next = computeNextState(state, action);
    setState(next);

    try {
      const result = await onFeedback(reviewId, action);
      if (!result) {
        setState(prevRef.current);
      }
    } catch {
      setState(prevRef.current);
    } finally {
      setIsUpdating(false);
    }
  }, [reviewId, state, isUpdating, onFeedback]);

  const handleHelpful = useCallback(() => handleAction("helpful"), [handleAction]);
  const handleNotHelpful = useCallback(() => handleAction("not_helpful"), [handleAction]);

  return { ...state, isUpdating, handleHelpful, handleNotHelpful };
}
