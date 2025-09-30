/* ***********************
 * Account Routes
 ************************/
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")

/* ***********************
 * Deliver login view
 ************************/
router.get("/login", utilities.handleErrors(accountController.displayLoginForm))
router.get('/register', utilities.handleErrors(accountController.buildRegister))

router.post('/register', utilities.handleErrors(accountController.registerAccount))


module.exports = router