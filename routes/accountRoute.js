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

router.post('/register', utilities.handleErrors(accountController.registerAccount))
router.post('/login/test', utilities.handleErrors(accountController.accountLogin))
router.get('/management', checkAuth, utilities.handleErrors(accountController.buildSuccess))


module.exports = router