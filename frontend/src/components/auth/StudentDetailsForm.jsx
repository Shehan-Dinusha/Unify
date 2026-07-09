import React, { useState, useEffect } from "react";
import DatePicker from "../common/DatePicker";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import ImageUpload from "../common/ImageUpload";
import Select from "../common/Select";
import { GraduationCap, MapPin, Plus } from "lucide-react";
import { validateDOB } from "../../utils/validation";
import api from "../../services/api";

const StudentDetailsForm = ({ onNext, initialData, loading }) => {
  // ── Dropdown data from backend ─────────────────────────────────────────────
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  // ── Form state ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    regNumber: initialData?.registrationNumber || "",
    gender: initialData?.gender?.toLowerCase() || "",
    dob: "", // Will be set in useEffect
    addresses: initialData?.addresses?.length
      ? initialData.addresses.map(a => ({ street: a.street || "", city: a.city || "", postalCode: a.postalCode || "" }))
      : [{ street: "", city: "", postalCode: "" }],
    universityId: initialData?.universityId ? String(initialData.universityId) : "",
    facultyId: initialData?.facultyId ? String(initialData.facultyId) : "",
    degreeId: initialData?.degreeId ? String(initialData.degreeId) : "",
    batchId: initialData?.batchId ? String(initialData.batchId) : "",
    profileImage: null,
  });

  // Sync initialData when it becomes available
  useEffect(() => {
    if (initialData) {
      // Format ISO date (YYYY-MM-DD) to MM/DD/YYYY
      let formattedDob = "";
      if (initialData.dateOfBirth) {
        const date = new Date(initialData.dateOfBirth);
        if (!isNaN(date.getTime())) {
          formattedDob = `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
        }
      }

      setFormData({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        regNumber: initialData.registrationNumber || "",
        gender: initialData.gender?.toLowerCase() || "",
        dob: formattedDob,
        addresses:
          initialData.addresses?.length
            ? initialData.addresses.map(a => ({ street: a.street || "", city: a.city || "", postalCode: a.postalCode || "" }))
            : [{ street: "", city: "", postalCode: "" }],
        universityId: initialData.universityId
          ? String(initialData.universityId)
          : "",
        facultyId: initialData.facultyId ? String(initialData.facultyId) : "",
        degreeId: initialData.degreeId ? String(initialData.degreeId) : "",
        batchId: initialData.batchId ? String(initialData.batchId) : "",
        profileImage: null,
      });
    }
  }, [initialData]);

  const [errors, setErrors] = useState({});

  // ── Fetch universities and batches on mount ────────────────────────────────
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingMeta(true);
        const [uniRes, batchRes] = await Promise.all([
          api.get("/education/universities"),
          api.get("/education/batches"),
        ]);

        const uniData = uniRes.data?.data || [];
        const batchData = batchRes.data?.data || [];

        setUniversities(
          uniData.map((u) => ({ value: String(u.id), label: u.name }))
        );
        setBatches(
          batchData.map((b) => ({ value: String(b.id), label: b.name }))
        );

        // Auto-select first (and only) university: University of Moratuwa
        if (uniData.length > 0) {
          const uomId = String(uniData[0].id);
          setFormData((prev) => ({ ...prev, universityId: uomId }));

          // Fetch faculties for that university
          const facRes = await api.get(
            `/education/universities/${uomId}/faculties`
          );
          const facData = facRes.data?.data || [];
          setFaculties(
            facData.map((f) => ({ value: String(f.id), label: f.name }))
          );
        }
      } catch (err) {
      } finally {
        setLoadingMeta(false);
      }
    };

    fetchInitialData();
  }, []);

  // ── Fetch degrees when faculty changes ────────────────────────────────────
  useEffect(() => {
    if (!formData.facultyId) {
      setDegrees([]);
      return;
    }
    const fetchDegrees = async () => {
      try {
        const res = await api.get(
          `/education/faculties/${formData.facultyId}/degrees`
        );
        const degData = res.data?.data || [];
        setDegrees(
          degData.map((d) => ({ value: String(d.id), label: d.name }))
        );
      } catch (err) {
        setDegrees([]);
      }
    };
    fetchDegrees();
  }, [formData.facultyId]);

  // ── Validation ─────────────────────────────────────────────────────────────
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

    if (!formData.facultyId) newErrors.facultyId = "Faculty is required";
    if (!formData.degreeId) newErrors.degreeId = "Degree is required";
    if (!formData.batchId) newErrors.batchId = "Batch is required";

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
    formData.facultyId &&
    formData.degreeId &&
    formData.batchId;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "facultyId") {
      // Reset degree when faculty changes
      setFormData((prev) => ({ ...prev, facultyId: value, degreeId: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
    if (!validateForm()) return;

    // Convert date from MM/DD/YYYY → YYYY-MM-DD for backend ISO8601 validation
    let dateOfBirth = formData.dob;
    if (dateOfBirth && dateOfBirth.includes("/")) {
      const [month, day, year] = dateOfBirth.split("/");
      dateOfBirth = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    const submissionData = {
      ...formData,
      dateOfBirth,
      // Send numeric IDs as integers
      universityId: parseInt(formData.universityId, 10),
      facultyId: parseInt(formData.facultyId, 10),
      degreeId: parseInt(formData.degreeId, 10),
      batchId: parseInt(formData.batchId, 10),
    };

    onNext(submissionData);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
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

        <ImageUpload onChange={handleImageChange} label="Upload Photo (Optional)" value={initialData?.user?.avatar || null} />

        {loadingMeta ? (
          <p className="text-text-secondary text-body-small text-center animate-pulse">
            Loading academic data...
          </p>
        ) : (
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

            {/* Addresses */}
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
                            (_, i) => i !== index
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

            {/* University (auto-selected, read-only) */}
            <div className="md:col-span-2">
              <Input
                label="University"
                value={
                  universities.find((u) => u.value === formData.universityId)
                    ?.label || "University of Moratuwa"
                }
                disabled
                icon={GraduationCap}
              />
            </div>

            {/* Faculty — real IDs from backend */}
            <Select
              label="Faculty"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              options={faculties}
              placeholder="Select Faculty"
              error={errors.facultyId}
            />

            {/* Degree — loaded based on selected faculty */}
            <Select
              label="Degree"
              name="degreeId"
              value={formData.degreeId}
              onChange={handleChange}
              options={degrees}
              placeholder={
                formData.facultyId ? "Select Degree" : "Select Faculty first"
              }
              disabled={!formData.facultyId}
              error={errors.degreeId}
            />

            {/* Batch — real IDs from backend */}
            <Select
              label="Batch"
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              options={batches}
              placeholder="Select Batch"
              error={errors.batchId}
            />

            <div className="md:col-span-2 pt-8">
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
        )}

        <p className="text-text-secondary text-body-extra-small text-center">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </Card>
  );
};

export default StudentDetailsForm;
