const { body, validationResult } = require("express-validator")

// Vehicle validation rules
const vehicleValidationRules = ( ) => {
  return [
    body("classification_id")
      .notEmpty().withMessage("Classification is required."),
    body("inv_make")
      .trim()
      .isLength({ min: 3 }).withMessage("Make must be at least 3 characters."),
    body("inv_model")
      .trim()
      .isLength({ min: 3 }).withMessage("Model must be at least 3 characters."),
    body("inv_description")
      .notEmpty().withMessage("Description is required."),
    body("inv_image")
      .notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail")
      .notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price")
      .isFloat({ min: 0 }).withMessage("Price must be a valid number."),
    body("inv_year")
      .isInt({ min: 1900, max: 2100 }).withMessage("Year must be a valid 4-digit year."),
    body("inv_miles")
      .isInt({ min: 0 }).withMessage("Miles must be a positive integer."),
    body("inv_color")
      .trim()
      .notEmpty().withMessage("Color is required.")
  ]
}

// Middleware to check validation results
const checkInventoryValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" | "))
    return res.redirect("/inv/add-inventory")
  }
  next()
}

const deleteAccountRules = () => {
  return [
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required to delete your account.")
  ];
};
const checkDeleteAccountData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("account/delete-account", {
      title: "Delete Account",
      nav,
      message: "Please fix the errors below.",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { vehicleValidationRules, checkInventoryValidation, deleteAccountRules, checkDeleteAccountData }