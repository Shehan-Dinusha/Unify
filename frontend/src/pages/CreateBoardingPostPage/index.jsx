import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import { useCreateBoardingPost } from "./useCreateBoardingPost";
import BoardingBasicInfo from "./BoardingBasicInfo";
import BoardingAmenities from "./BoardingAmenities";
import BoardingPricing from "./BoardingPricing";
import BoardingPreview from "./BoardingPreview";
import BoardingActions from "./BoardingActions";

const CreateBoardingPostPage = () => {
  const {
    user,
    title, setTitle,
    description, setDescription,
    location,
    latitude, longitude,
    roomType, setRoomType,
    gender, setGender,
    amenityInput, setAmenityInput,
    amenities,
    price, setPrice,
    capacity, setCapacity,
    phone, setPhone,
    slots, setSlots,
    loading,
    images,
    isDragging, setIsDragging,
    fileInputRef,
    handleFiles,
    removeImage,
    handleAddAmenity,
    handleRemoveAmenity,
    handleCancel,
    handleLocationChange,
    handlePublish,
  } = useCreateBoardingPost();

  return (
    <MainLayout user={user} pageTitle="Create Boarding Post" verificationCount={0}>
      <div className="max-w-[1400px] mx-auto py-8">
        <div className="flex flex-col w-full h-full text-white font-inter">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
            <div className="flex flex-col gap-6 pb-8 min-w-0">
              <BoardingBasicInfo
                title={title} setTitle={setTitle}
                description={description} setDescription={setDescription}
                location={location}
                latitude={latitude} longitude={longitude}
                roomType={roomType} setRoomType={setRoomType}
                gender={gender} setGender={setGender}
                images={images}
                isDragging={isDragging} setIsDragging={setIsDragging}
                fileInputRef={fileInputRef}
                onFiles={handleFiles} onRemoveImage={removeImage}
                onLocationChange={handleLocationChange}
              />
              <BoardingAmenities
                amenityInput={amenityInput} setAmenityInput={setAmenityInput}
                amenities={amenities}
                onAddAmenity={handleAddAmenity} onRemoveAmenity={handleRemoveAmenity}
              />
              <BoardingPricing
                price={price} setPrice={setPrice}
                capacity={capacity} setCapacity={setCapacity}
                phone={phone} setPhone={setPhone}
                slots={slots} setSlots={setSlots}
              />
            </div>

            <div className="flex flex-col gap-6 sticky top-4 h-fit min-w-0">
              <BoardingPreview
                images={images} price={price}
                title={title} location={location}
                description={description} amenities={amenities} user={user}
              />
              <BoardingActions loading={loading} onCancel={handleCancel} onPublish={handlePublish} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateBoardingPostPage;
