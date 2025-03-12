import { body, validationResult } from "express-validator";

// ✅ Signup Validation Middleware
export const validateSignup = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  // body("password")
  //   .isLength({ min: 6 })
  //   .withMessage("Password must be at least 6 characters long"),
  body("phone")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  body("role")
    .isIn(["owner", "tenant", "admin"])
    .withMessage("Role must be either owner, tenant, or admin"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// validation login

export const validateLogin = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];