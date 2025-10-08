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
const { deleteAccountRules, checkDeleteAccountData } = require('../validators/accountValidation')
// const { checkJWTToken } = require("../middleware/auth")

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

/* ******************************************************
*  Additional Enhancements:  Delete account routes
*********************************************************/
router.get(
  "/delete",
  utilities.checkLogin, 
  accountController.buildDeleteAccount
);

/* *******************************************
*  Additional Enhancements:  Admin-only access
**********************************************/
router.post(
  "/delete",
  utilities.checkLogin,
//   deleteAccountRules,
//   checkDeleteAccountData,
  accountController.deleteAccount
);

router.get(
  "/change-type",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAdmin,
  accountController.buildChangeAccountType
)

router.post(
  "/change-type",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.checkAdmin, 
  accountController.changeAccountType
)


module.exports = router