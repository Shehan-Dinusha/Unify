import React, { useState } from "react";
import DatePicker from "../common/DatePicker";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import Select from "../common/Select";
import { Camera, GraduationCap, MapPin, Plus } from "lucide-react";
import { validateDOB } from "../../utils/validation";

const StudentDetailsForm = ({ onNext }) => {
  const facultyOptions = [
    { value: "it", label: "IT" },
    { value: "engineering", label: "Engineering" },
    { value: "business", label: "Business" },
  ];

  const facultyData = {
    it: {
      departments: [
        { value: "it", label: "Information Technology" },
        { value: "ds", label: "Data Science" },
      ],
      degrees: [
        { value: "bsc_it", label: "BSc Information Technology" },
        { value: "msc_ds", label: "MSc Data Science" },
      ],
    },
    engineering: {
      departments: [
        { value: "cse", label: "Computer Science and Engineering" },
        { value: "ee", label: "Electrical Engineering" },
        { value: "me", label: "Mechanical Engineering" },
        { value: "ce", label: "Civil Engineering" },
      ],
      degrees: [
        { value: "bsc_eng", label: "BSc Engineering" },
        { value: "meng", label: "MEng" },
      ],
    },
    business: {
      departments: [
        { value: "ba", label: "Business Administration" },
        { value: "acc", label: "Accounting and Finance" },
      ],
      degrees: [
        { value: "bba", label: "Bachelor of Business Administration" },
        { value: "mba", label: "Master of Business Administration" },
      ],
    },
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const batchOptions = [
    { value: "21", label: "Batch 21" },
    { value: "22", label: "Batch 22" },
    { value: "23", label: "Batch 23" },
    { value: "24", label: "Batch 24" },
    { value: "25", label: "Batch 25" },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    regNumber: "",
    gender: "",
    dob: "",
    addresses: [{ street: "", city: "", postalCode: "" }],
    university: "University Of Moratuwa",
    faculty: "",
    department: "",
    degree: "",
    batch: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.regNumber.trim())
      newErrors.regNumber = "Registration number is required";
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

    if (!formData.faculty) newErrors.faculty = "Faculty is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.degree) newErrors.degree = "Degree is required";
    if (!formData.batch) newErrors.batch = "Batch is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormComplete =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.regNumber.trim() &&
    formData.gender &&
    formData.dob &&
    formData.addresses[0].street.trim() &&
    formData.addresses[0].city.trim() &&
    formData.addresses[0].postalCode.trim() &&
    formData.faculty &&
    formData.department &&
    formData.degree &&
    formData.batch;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "faculty") {
      setFormData((prev) => ({
        ...prev,
        faculty: value,
        department: "",
        degree: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
    <Card
      variant="card"
      className="w-full max-w-[680px] p-2 sm:p-4"
      overflow="overflow-visible"
    >
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
          className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
        >
          <Input
            label="First Name"
            name="firstName"
            placeholder="Enter First Name"
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
            label="Registration Number"
            name="regNumber"
            placeholder="Enter your Registration Number"
            value={formData.regNumber}
            onChange={handleChange}
            error={errors.regNumber}
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
                <div className="grid grid-cols-2 gap-4">
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

          <div className="md:col-span-2">
            <Input
              label="University"
              value={formData.university}
              disabled
              icon={GraduationCap}
            />
          </div>

          <Select
            label="Faculty"
            name="faculty"
            value={formData.faculty}
            onChange={handleChange}
            options={facultyOptions}
            placeholder="Select Faculty"
            error={errors.faculty}
          />

          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            options={
              formData.faculty ? facultyData[formData.faculty].departments : []
            }
            placeholder={
              formData.faculty ? "Select Department" : "Select Faculty first"
            }
            disabled={!formData.faculty}
            error={errors.department}
          />

          <Select
            label="Degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            options={
              formData.faculty ? facultyData[formData.faculty].degrees : []
            }
            placeholder={
              formData.faculty ? "Select Degree" : "Select Faculty first"
            }
            disabled={!formData.faculty}
            error={errors.degree}
          />

          <Select
            label="Batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            options={batchOptions}
            placeholder="Select Batch"
            error={errors.batch}
          />

          <div className="md:col-span-2 pt-8">
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

export default StudentDetailsForm;
