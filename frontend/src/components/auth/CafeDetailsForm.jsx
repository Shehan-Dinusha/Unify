import React, { useState } from "react";
import { Camera, Store, Contact, Info } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

const CafeDetailsForm = ({ onNext }) => {
  const [formData, setFormData] = useState({
    cafeName: "",
    displayName: "",
    about: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cafeName.trim()) newErrors.cafeName = "Cafe name is required";
    if (!formData.displayName.trim())
      newErrors.displayName = "Display name is required";
    if (!formData.about.trim()) newErrors.about = "About info is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete =
    formData.cafeName.trim() &&
    formData.displayName.trim() &&
    formData.about.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
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

        <div className="flex flex-col items-center gap-2">
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group cursor-pointer hover:border-primary-blue/50 transition-colors">
            <Camera
              size={20}
              className="text-text-tertiary group-hover:text-primary-blue transition-colors"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary-blue rounded-full flex items-center justify-center border-2 border-dark-1">
              <Camera size={10} className="text-white" />
            </div>
          </div>
          <span className="text-text-tertiary text-body-extra-small">
            Upload Photo (Optional)
          </span>
        </div>

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
              disabled={!isFormComplete}
            >
              Save & Continue
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
