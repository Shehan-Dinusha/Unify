import React, { useState } from "react";
import { Camera, Store, Contact, Info } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

import ImageUpload from "../common/ImageUpload";

const CafeDetailsForm = ({ onNext, initialData, loading }) => {
  const [formData, setFormData] = useState({
    cafeName: initialData?.businessName || "",
    displayName: initialData?.displayName || "",
    about: initialData?.about || "",
    profileImage: null,
  });

  // Sync initialData when it becomes available
  React.useEffect(() => {
    if (initialData) {
      setFormData({
        cafeName: initialData.businessName || "",
        displayName: initialData.displayName || "",
        about: initialData.about || "",
        profileImage: null,
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});

  // Form is complete when required fields are filled
  const isFormComplete =
    formData.cafeName.trim() !== "" && formData.displayName.trim() !== "" && formData.about.trim() !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormComplete) return;
    onNext(formData);
  };

  return (
    <Card variant="card" className="w-full max-w-[680px] p-2 sm:p-4">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <h1 className="text-white text-heading-medium font-bold font-inter leading-tight">
            Personal Details
          </h1>
          <p className="text-text-secondary text-body-small leading-relaxed max-w-[400px]">
            Tell us a bit about yourself to complete your profile.
          </p>
        </div>

        <ImageUpload
          onChange={handleImageChange}
          label="Upload Photo (Optional)"
        />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          <div className="md:col-span-2">
            <Input
              label="Cafe name"
              name="cafeName"
              placeholder="Official business name"
              icon={Store}
              value={formData.cafeName}
              onChange={handleChange}
              error={errors.cafeName}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Display name"
              name="displayName"
              placeholder="How you want to appear"
              icon={Contact}
              value={formData.displayName}
              onChange={handleChange}
              error={errors.displayName}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="About us"
              name="about"
              placeholder="Tell us about your cafe..."
              icon={Info}
              value={formData.about}
              onChange={handleChange}
              error={errors.about}
            />
          </div>

          <div className="md:col-span-2 pt-6">
            <Button
              variant="primary"
              fullWidth
              size="large"
              type="submit"
              className="shadow-custom-shadow"
              disabled={!isFormComplete || loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </form>

        <p className="text-text-secondary text-body-extra-small text-center">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </Card>
  );
};

export default CafeDetailsForm;
