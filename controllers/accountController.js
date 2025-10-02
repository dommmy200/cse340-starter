const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt") 

const accountController = {}

/* ***************************
 *  Build login by account view
 * ************************** */
// GET request to display the form.
accountController.displayLoginForm = async function (req, res, next) {
    let nav = await utilities.getNav();
    const loginGrid = await utilities.buildLoginGrid();
    // req.flash("notice", "Login Process")

    res.render("account/login", {
      title: 'Login',
      nav,
      loginGrid,
      notice: req.flash("notice")
    })
}
accountController.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav();
    const registerGrid = await utilities.buildRegisterGrid();

    req.flash("notice", "Required fiels are mandatory")
    
    res.render("account/register", {
        title: 'Register',
        nav,
        registerGrid
    })
}
/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash password here before saving
  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // save hashed password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    const loginGrid = await utilities.buildLoginGrid()
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      loginGrid
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav()
  // const { account_email, account_password } = req.body
  // const accountData = await accountModel.getAccountByEmail(account_email)
  const { account_email, account_password } = req.body
  console.log("accountData from DB:", account_email)
  console.log("accountData from DB:", account_password)
  // const hashedPassword = await bcrypt.hash(account_password, 10) // 10 salt rounds
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log("accountData from DB:", accountData)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    const loginGrid = await utilities.buildLoginGrid();
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      loginGrid
    })
    return
  }
  console.log('Outside Try-Catch')
  try {
    console.log('Inside Try-Catch')
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      console.log('Inside Try-Catch, If-statement')
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/management")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      const loginGrid = await utilities.buildLoginGrid();
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        loginGrid
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

accountController.buildSuccess = async function (req, res) {
  let nav = await utilities.getNav();
    const successGrid = await utilities.loginSuccessGrid();

    // const loginGrid = await utilities.buildLoginGrid();
    res.render("account/management", {
      title: 'Success',
      nav,
      successGrid,
      message: req.flash("notice", "Login successful")
    })
}

module.exports = accountController