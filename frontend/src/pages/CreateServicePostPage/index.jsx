import React from "react";
import { Edit3, Loader2 } from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import Card from "../../components/common/Card";
import FoodCafeCard from "../../components/marketplace/FoodCafeCard";
import { useCreateServicePost } from "./useCreateServicePost";
import ImageUploader from "./ImageUploader";

const CreateServicePostPage = () => {
  const {
    user, description, setDescription, loading, images, isDragging, setIsDragging,
    fileInputRef, handleFiles, removeImage, handleCancel, handlePublish,
  } = useCreateServicePost();

  return (
    <MainLayout user={user} pageTitle="Create Post" verificationCount={0}>
      <div className="max-w-[1400px] mx-auto py-8">
        <div className="flex flex-col w-full h-full text-white font-inter">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
            <div className="flex flex-col gap-6 pb-8 min-w-0">
              <Card variant="card" className="bg-[#1A2F45]/60 border-white/5 !p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Edit3 className="w-5 h-5" /></div>
                  <div>
                    <h3 className="text-lg font-bold">Basic Information</h3>
                    <p className="text-text-secondary text-xs mt-0.5">Enter the core details of your service</p>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <ImageUploader
                    images={images} isDragging={isDragging} setIsDragging={setIsDragging}
                    fileInputRef={fileInputRef} handleFiles={handleFiles} removeImage={removeImage} />
                  <div>
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 block">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your services in detail..." rows={6}
                      className="w-full bg-[#0F172A]/80 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-blue transition-colors resize-y placeholder:text-text-secondary" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col gap-6 sticky top-4 h-fit min-w-0">
              <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 px-4">Feed Preview</div>
              <div className="pointer-events-none">
                <FoodCafeCard post={{
                  id: "preview", author: { name: user.name }, userSeed: user.name, time: "Just now",
                  description: description || "Your post description will appear here...",
                  images: images.length > 0 ? images.map(img => img.url) : null, stats: { likes: 0 }, comments: [],
                }} />
              </div>
              <div className="flex gap-4 mb-8">
                <button type="button" onClick={handleCancel} disabled={loading}
                  className="flex-1 py-3 bg-[#1A2536] hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/5 disabled:opacity-50">Cancel</button>
                <button type="button" onClick={handlePublish} disabled={loading}
                  className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(43,140,238,0.4)] flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Publishing..." : "Publish Service"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateServicePostPage;
