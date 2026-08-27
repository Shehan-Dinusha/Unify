import React from "react";

const CreatePostModal = ({ onClose, onCreateLost, onCreateFound }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    {/* Blurred backdrop */}
    <div className="absolute inset-0 bg-dark-1/70 backdrop-blur-md" />

    {/* Modal card */}
    <div
      className="relative w-full max-w-3xl bg-dark-2 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-custom-shadow animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <h2 className="text-heading-small sm:text-heading-medium text-text-primary mb-2">
          Create New Post
        </h2>
        <p className="text-body-small text-text-secondary">
          Select the type of content you want to share.
        </p>
      </div>

      {/* Option Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Lost Item */}
        <div className="flex flex-col items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-primary-blue/40 transition-colors text-center">
          <h3 className="text-body-large-bold text-text-primary">Lost Item</h3>
          <p className="text-body-small text-text-secondary leading-relaxed flex-1">
            Report an item you&apos;ve lost. Provide detailed information such as
            location, date, and distinguishing features to help others identify
            and return it quickly.
          </p>
          <button
            onClick={onCreateLost}
            className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]"
          >
            Create Lost Item Post
          </button>
        </div>

        {/* Found Item */}
        <div className="flex flex-col items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 hover:border-primary-blue/40 transition-colors text-center">
          <h3 className="text-body-large-bold text-text-primary">Found Item</h3>
          <p className="text-body-small text-text-secondary leading-relaxed flex-1">
            Lost something important? Create a post with clear details about
            when and where it was last seen, along with any identifying
            features, to increase the chances of recovery.
          </p>
          <button
            onClick={onCreateFound}
            className="w-full py-2.5 rounded-xl bg-primary-blue hover:brightness-110 text-white text-body-small-bold transition-all active:scale-[0.98]"
          >
            Create Found Item Post
          </button>
        </div>
      </div>

      {/* Cancel */}
      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-xl border border-white/10 text-body-small text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default CreatePostModal;
