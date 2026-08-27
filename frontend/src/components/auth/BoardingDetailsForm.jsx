import React, { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";
import DatePicker from "../common/DatePicker";
import ImageUpload from "../common/ImageUpload";
import { validateNIC, validateDOB } from "../../utils/validation";

const BoardingDetailsForm = ({ onNext, initialData, loading }) => {
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    nic: initialData?.nic || "",
    gender: initialData?.gender?.toLowerCase() || "",
    dob: "", // Will be set in useEffect
    addresses: initialData?.addresses?.length
      ? initialData.addresses.map(a => ({ street: a.street || "", city: a.city || "", postalCode: a.postalCode || "" }))
      : [{ street: "", city: "", postalCode: "" }],
    profileImage: null,
  });

  // Sync initialData when it becomes available
  React.useEffect(() => {
    if (initialData) {
      // Format ISO date (YYYY-MM-DD) to MM/DD/YYYY
      let formattedDob = "";
      if (initialData.dob) {
        const date = new Date(initialData.dob);
        if (!isNaN(date.getTime())) {
          formattedDob = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
        }
      }

      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        nic: initialData.nic || "",
        gender: initialData.gender?.toLowerCase() || "",
        dob: formattedDob,
        addresses:
          initialData.addresses?.length
            ? initialData.addresses.map(a => ({ street: a.street || "", city: a.city || "", postalCode: a.postalCode || "" }))
            : [{ street: "", city: "", postalCode: "" }],
        profileImage: null,
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.nic.trim()) {
      newErrors.nic = "NIC is required";
    } else if (!validateNIC(formData.nic)) {
      newErrors.nic = "Please enter a valid NIC number";
    }

    if (!formData.gender) newErrors.gender = "Gender is required";

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
    } else if (!validateDOB(formData.dob)) {
      newErrors.dob = "Please select a valid date of birth";
    }

    if (!formData.addresses[0].street.trim())
      newErrors.street = "Street address is required";
    if (!formData.addresses[0].city.trim()) newErrors.city = "City is required";
    if (!formData.addresses[0].postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.nic.trim() &&
    formData.gender &&
    formData.dob &&
    formData.addresses[0].street.trim() &&
    formData.addresses[0].city.trim() &&
    formData.addresses[0].postalCode.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, profileImage: file }));
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...formData.addresses];
    newAddresses[index][field] = value;
    setFormData((prev) => ({ ...prev, addresses: newAddresses }));
    if (index === 0 && errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { street: "", city: "", postalCode: "" }],
    }));
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

        <ImageUpload
          onChange={handleImageChange}
          label="Upload Photo (Optional)"
          value={initialData?.user?.avatar || null}
        />

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"
        >
          <Input
            label="First Name"
            name="firstName"
            placeholder="Enter Full Name"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Enter Last Name"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Input
            label="NIC"
            name="nic"
            placeholder="Enter your NIC Number"
            value={formData.nic}
            onChange={handleChange}
            error={errors.nic}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
            placeholder="Select Gender"
            error={errors.gender}
          />

          <div className="md:col-span-2">
            <DatePicker
              label="Date of Birth"
              name="dob"
              placeholder="mm/dd/yyyy"
              value={formData.dob}
              onChange={handleChange}
              error={errors.dob}
              maxDate={new Date()}
            />
          </div>

          <div className="md:col-span-2 flex flex-col gap-6">
            {formData.addresses.map((addr, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <label className="text-text-tertiary text-xs font-bold font-inter leading-5 uppercase tracking-wider">
                    Address {formData.addresses.length > 1 ? index + 1 : ""}
                  </label>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newAddresses = formData.addresses.filter(
                          (_, i) => i !== index,
                        );
                        setFormData((prev) => ({
                          ...prev,
                          addresses: newAddresses,
                        }));
                      }}
                      className="text-state-error text-xs hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Street Address"
                  icon={MapPin}
                  value={addr.street}
                  onChange={(e) =>
                    handleAddressChange(index, "street", e.target.value)
                  }
                  error={index === 0 ? errors.street : undefined}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="City"
                    value={addr.city}
                    onChange={(e) =>
                      handleAddressChange(index, "city", e.target.value)
                    }
                    error={index === 0 ? errors.city : undefined}
                  />
                  <Input
                    placeholder="Postal Code"
                    value={addr.postalCode}
                    onChange={(e) =>
                      handleAddressChange(index, "postalCode", e.target.value)
                    }
                    error={index === 0 ? errors.postalCode : undefined}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={handleAddAddress}
              className="flex items-center gap-2 text-primary-blue text-body-small-bold hover:underline transition-all active:scale-95"
            >
              <div className="w-5 h-5 rounded-full border border-primary-blue flex items-center justify-center">
                <Plus size={12} />
              </div>
              Add another address
            </button>
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

export default BoardingDetailsForm;
