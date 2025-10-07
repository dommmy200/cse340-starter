/* ***********************
 * Account Routes
 ************************/
// Needed Resources 
const express = require("express")
const router = new express.Router() 
// const { body } = require("express-validator")
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const { passwordChangeRules, updateAccountRules } = require("../utilities")
const { checkAuth } = require('../middleware/auth')

// // Validation for updating account info
// const updateAccountRules = [
//   body("account_firstname")
//     .trim()
//     .isLength({ min: 2 })
//     .withMessage("First name must be at least 2 characters long."),
//   body("account_lastname")
//     .trim()
//     .isLength({ min: 2 })
//     .withMessage("Last name must be at least 2 characters long."),
//   body("account_email")
//     .trim()
//     .isEmail()
//     .withMessage("Please enter a valid email address.")
//     .custom(async (value, { req }) => {
//       const account = await accountModel.getAccountByEmail(value)
//       if (account && account.account_id != req.body.account_id) {
//         throw new Error("This email is already in use by another account.")
//       }
//     }),
// ]
// // Validation for changing password
// const passwordChangeRules = [
//   body("new_password")
//     .trim()
//     .isLength({ min: 12 })
//     .withMessage("Password must be at least 12 characters long.")
//     .matches(/[A-Z]/)
//     .withMessage("Password must contain at least one uppercase letter.")
//     .matches(/\d/)
//     .withMessage("Password must contain at least one number.")
//     .matches(/[!@#$%^&*(),.?":{}|<>]/)
//     .withMessage("Password must contain at least one special character."),
//   body("confirm_password")
//     .custom((value, { req }) => {
//       if (value !== req.body.new_password) {
//         throw new Error("Passwords do not match.")
//       }
//       return true
//     }),
// ]

/* ***********************
 * Deliver login view
 ************************/
router.get("/login", utilities.handleErrors(accountController.displayLoginForm))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.get("/logout", utilities.handleErrors(accountController.accountLogout));


router.post('/register', utilities.handleErrors(accountController.registerAccount))
router.post('/login/test', utilities.handleErrors(accountController.accountLogin))
router.get('/management', checkAuth, utilities.handleErrors(accountController.buildSuccess))
// Show update form
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))
// Handle account info update
router.post("/update/:account_id", updateAccountRules, utilities.handleErrors(accountController.handleAccountUpdate))
// Handle password change
router.post("/update-password/:account_id", passwordChangeRules, utilities.checkLogin, utilities.handleErrors(accountController.handlePasswordChange))


module.exports = router