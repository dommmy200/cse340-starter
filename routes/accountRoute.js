/* ***********************
 * Account Routes
 ************************/
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const { checkAuth } = require('../middleware/auth')

/* ***********************
 * Deliver login view
 ************************/
router.get("/login", utilities.handleErrors(accountController.displayLoginForm))
router.get('/register', utilities.handleErrors(accountController.buildRegister))
router.get("/logout", utilities.handleErrors(accountController.accountLogout));


router.post('/register', utilities.handleErrors(accountController.registerAccount))
router.post('/login/test', utilities.handleErrors(accountController.accountLogin))
router.get('/management', checkAuth, utilities.handleErrors(accountController.buildSuccess))
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))
router.post("/update/:account_id", utilities.handleErrors(accountController.handleAccountUpdate))


module.exports = router