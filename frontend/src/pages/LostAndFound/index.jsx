import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import CreatePostModal from "../../components/lost-found/CreatePostModal";
import ReportItemForm from "../../components/lost-found/ReportItemForm";
import { useLostAndFound, FILTERS } from "./useLostAndFound";
import ItemCard from "./ItemCard";
import ItemDetailViewWrapper from "./ItemDetailViewWrapper";

const LostAndFound = () => {
  const {
    currentUser, user,
    view, setView,
    searchParams, setSearchParams,
    activeFilter, setActiveFilter,
    filteredItems, isLoading,
  } = useLostAndFound();

  const headerRight = view === "list" ? (
    <button
      onClick={() => setView("modal")}
      className="bg-primary-blue hover:brightness-110 text-white text-body-small-bold px-5 py-2 rounded-full transition-all active:scale-95"
    >
      Create Post
    </button>
  ) : null;

  if (!currentUser) return null;

  return (
    <MainLayout user={user} pageTitle="Lost & Found" verificationCount={0} headerRight={headerRight}>
      {view === "detail" ? (
        <ItemDetailViewWrapper
          id={Number(searchParams.get("id"))}
          onBack={() => setView("list")}
          onSelectMatch={(matchId) => setSearchParams({ view: "detail", id: String(matchId) }, { replace: false })}
        />
      ) : view === "lostForm" || view === "foundForm" ? (
        <ReportItemForm type={view === "lostForm" ? "lost" : "found"} onBack={() => setView("list")} />
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-5xl mx-auto px-2 sm:px-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 sm:px-5 py-2 rounded-full text-body-small font-semibold transition-all duration-150 whitespace-nowrap ${
                  activeFilter === filter
                    ? "bg-primary-blue text-white"
                    : "bg-white/5 text-text-secondary hover:bg-white/10 border border-white/10"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center text-text-secondary py-10">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onSelect={(id) => setSearchParams({ view: "detail", id: String(id) }, { replace: false })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === "modal" && (
        <CreatePostModal
          onClose={() => setView("list")}
          onCreateLost={() => setView("lostForm")}
          onCreateFound={() => setView("foundForm")}
        />
      )}
    </MainLayout>
  );
};

export default LostAndFound;
