import { body } from "express-validator";
import { University, Faculty, Degree, Batch } from "../modules/index.js";

export const studentProfileValidator = [
  body("registrationNumber")
    .trim()
    .notEmpty()
    .withMessage("Registration number is required"),
  
  body("universityId")
    .notEmpty()
    .withMessage("University is required")
    .isInt()
    .custom(async (value) => {
      const university = await University.findByPk(value);
      if (!university) throw new Error("Invalid University ID");
      return true;
    }),

  body("facultyId")
    .notEmpty()
    .withMessage("Faculty is required")
    .isInt()
    .custom(async (value) => {
      const faculty = await Faculty.findByPk(value);
      if (!faculty) throw new Error("Invalid Faculty ID");
      return true;
    }),

  body("degreeId")
    .notEmpty()
    .withMessage("Degree is required")
    .isInt()
    .custom(async (value) => {
      const degree = await Degree.findByPk(value);
      if (!degree) throw new Error("Invalid Degree ID");
      return true;
    }),

  body("batchId")
    .notEmpty()
    .withMessage("Batch is required")
    .isInt()
    .custom(async (value) => {
      const batch = await Batch.findByPk(value);
      if (!batch) throw new Error("Invalid Batch ID");
      return true;
    }),

  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(["male", "female", "other"])
    .withMessage("Invalid gender"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const dob = new Date(value);
      const today = new Date();
      if (dob > today) throw new Error("Date of birth cannot be in the future");
      
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 16) throw new Error("User must be at least 16 years old");
      if (age > 100) throw new Error("Please enter a valid date of birth");
      return true;
    }),

  body("addresses").optional().isArray().withMessage("Addresses must be an array"),
];

export const businessProfileValidator = [
  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["BOARDING", "FOOD", "SELF_EMPLOYED"])
    .withMessage("Invalid business category"),

  // Conditional Validation based on category
  body().custom((value, { req }) => {
    const { category } = req.body;

    if (category === "BOARDING") {
      if (!req.body.ownerFirstName && !req.body.firstName) throw new Error("Owner first name is required for boarding");
      if (!req.body.ownerLastName && !req.body.lastName) throw new Error("Owner last name is required for boarding");
      
      // NIC Validation (Sri Lanka formats: 9 digits + V/X OR 12 digits)
      const nic = req.body.nic;
      const nicRegex = /^([0-9]{9}[xXvV]|[0-9]{12})$/;
      if (!nic) throw new Error("NIC is required for boarding");
      if (!nicRegex.test(nic)) throw new Error("Invalid NIC format");

      if (!req.body.gender) throw new Error("Gender is required for boarding");
      
      // DOB Validation for Owner
      if (!req.body.dob) throw new Error("Date of birth is required for boarding");
      const dob = new Date(req.body.dob);
      if (dob > new Date()) throw new Error("Date of birth cannot be in the future");

      if (!req.body.addresses || !Array.isArray(req.body.addresses) || req.body.addresses.length === 0) {
        throw new Error("At least one address is required for boarding");
      }
    }

    if (category === "FOOD" || category === "SELF_EMPLOYED") {
      if (!req.body.displayName) throw new Error("Display name is required");
      if (!req.body.businessName && !req.body.cafeName) throw new Error("Business/Cafe name is required");
      if (!req.body.about) throw new Error("About section is required");
    }

    return true;
  }),

  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("phone").optional().trim().notEmpty().withMessage("Phone cannot be empty"),
  body("website").optional().isURL().withMessage("Invalid website URL"),
];

export const clubProfileValidator = [
  body("clubName")
    .trim()
    .notEmpty()
    .withMessage("Club name is required"),
  body("about")
    .trim()
    .notEmpty()
    .withMessage("About section is required"),
  body("email").optional().isEmail().withMessage("Invalid email format"),
];
