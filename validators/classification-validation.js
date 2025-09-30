const { body, validationResult } = require("express-validator")

// Validation rules
const classificationValidationRules = [
  body("classification_name")
    .trim()
    .notEmpty().withMessage("Classification name is required.")
    .isLength({ min: 3 }).withMessage("Classification name must be at least 3 characters.")
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage("Classification name must contain only letters and numbers.")
]

// Middleware to check validation results
function checkClassificationValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("error", errors.array().map(err => err.msg).join(" | "))
    return res.redirect("/inventory/add-classification")
  }
  next()
}

module.exports = { classificationValidationRules, checkClassificationValidation }
