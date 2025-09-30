const accountModel = require("../models/account-model")
const utilities = require("../utilities/")

const accountController = {}

/* ***************************
 *  Build login by account view
 * ************************** */
// GET request to display the form.
accountController.displayLoginForm = async function (req, res, next) {
    let nav = await utilities.getNav();
    const loginGrid = await utilities.buildLoginGrid();

    req.flash("notice", "Successfully login.")
    
    res.render("./account/login", {
        title: 'Login',
        nav,
        loginGrid
    })
}
accountController.buildRegister = async function (req, res, next) {
    let nav = await utilities.getNav();
    const registerGrid = await utilities.buildRegisterGrid();

    req.flash("notice", "Required fiels are mandatory")
    
    res.render("./account/register", {
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

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}
module.exports = accountController