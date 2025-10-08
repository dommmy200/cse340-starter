const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const { validationResult } = require("express-validator")
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
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
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
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      // 👇 Explicitly include only necessary data in JWT
      const payload = {
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type
      }
      // Create JWT token
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h"
      })
      // Set secure cookie
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 3600 * 1000
      })
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
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
    console.error("Login error:", error)
    req.flash("notice", "An error occurred while logging in.")
    const loginGrid = await utilities.buildLoginGrid();
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      loginGrid
    })
  }
}
/* ****************************************
 *  Logout Process
 * ************************************ */
accountController.accountLogout = async function (req, res) {
  try {
    // Clear the JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
    });

    req.flash("notice", "You have been logged out successfully.");
    // Destroy session if any (connect-flash may rely on it)
    if (req.session) {
      req.session.destroy(() => {
        return res.redirect("/");
      });
    } else {
      req.flash("notice", "You have been logged out successfully.");
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Logout error:", error);
    req.flash("notice", "An error occurred while logging out.");
    res.redirect("/");
  }
};


/* ****************************************
 *  Successful Login
 * *************************************** */
accountController.buildSuccess = async function (req, res) {
  let nav = await utilities.getNav();
  try {
    // Verify and decode JWT
    const token = req.cookies.jwt;
    if (!token) {
      req.flash("notice", "You must be logged in to access your account.");
      return res.redirect("/account/login");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    res.render("account/management", {
      title: "Account Management",
      nav,
      account_firstname: decoded.account_firstname,
      account_type: decoded.account_type,
      account_id: decoded.account_id,
      notice: req.flash("notice")
    });
  } catch (err) {
    console.error("Error decoding JWT:", err);
    req.flash("notice", "Session expired. Please log in again.");
    res.redirect("/account/login");
  }
}

/* ****************************************
 *  Render Update Account View
 * *************************************** */
accountController.buildUpdateAccount = async function (req, res) {
  const account_id = req.params.account_id;
  let nav = await utilities.getNav();
  
  const accountData = await accountModel.getAccountById(account_id);
  if (!accountData) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/login");
  }

  res.render("account/update", {
    title: "Update Account Information",
    nav,
    account: accountData,
    notice: req.flash("notice")
  });
};
/* ****************************************
 *  Handle Account Update
 * *************************************** */
accountController.handleAccountUpdate = async function (req, res, next) {
  try {
    const errors = validationResult(req)
    let nav = await utilities.getNav()
    const account_id = parseInt(req.params.account_id)

    
    if (!errors.isEmpty()) {
      const account = {
        account_id,
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email,
      }
      
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: errors.array(),
        account,
      })
    }
    
    const { account_firstname, account_lastname, account_email } = req.body
    // Update the account in the DB
    const updateResult = await accountModel.updateAccount(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    )

    if (updateResult) {
      // Fetch the updated account data
      const updatedAccount = await accountModel.getAccountById(account_id)

      // Remove password before generating JWT
      delete updatedAccount.account_password

      // Regenerate JWT with updated info
      const jwt = require("jsonwebtoken")
      const accessToken = jwt.sign(
        updatedAccount,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      )

      // Reset cookie with updated data
      res.clearCookie("jwt")
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        maxAge: 3600 * 1000,
        secure: process.env.NODE_ENV !== "development"
      })

      req.flash("notice", "Account information updated successfully.")
      return res.redirect("/account/management")
    } else {
      req.flash("notice", "Update failed. Please try again.")
      return res.status(500).render("account/update", {
        title: "Update Account",
        nav,
        account: { account_id, account_firstname, account_lastname, account_email },
        errors: null
      })
    }
  } catch (error) {
    console.error("Account update error:", error)
    next(error)
  }
}

/* ****************************************
 *  Process Password Change
 * *************************************** */
accountController.handlePasswordChange = async function (req, res) {
  const errors = validationResult(req)
  const nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  
  if (!errors.isEmpty()) {
    const account = await accountModel.getAccountById(account_id)
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: errors.array(),
      account,
    })
  }
  const { new_password } = req.body
  // Password encryption goes here b4 storage
  const hashedPassword = await bcrypt.hash(new_password, 10)
  const result = await accountModel.updatePassword(account_id, hashedPassword)

  if (result) {
    req.flash("notice", "Password changed successfully.")
    return res.redirect("/account/management")
  } else {
    req.flash("notice", "Password update failed.")
    return res.redirect(`/account/update/${account_id}`)
  }
}

/* ******************************************************
*  Additional Enhancements:  Render Delete confirmation view
*********************************************************/
accountController.buildDeleteAccount = async (req, res, next) => {
  const nav = await utilities.getNav();
  res.render("account/delete-account", {
    title: "Delete Account",
    nav,
    message: null,
  });
};

/* ******************************************************
*  Additional Enhancements:  Handle delete request
*********************************************************/
accountController.deleteAccount = async (req, res, next) => {
  try {
    const token = req.cookies.jwt
    if (!token) throw new Error("No token found")

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    console.log(' Decoded: ', decoded)
    const accountId = decoded.account_id
    const { password } = req.body

    // Get user info
    const user = await accountModel.getAccountById(accountId)
    if (!user) {
      throw new Error("Account not found.")
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.account_password)
    if (!passwordMatch) {
      const nav = await utilities.getNav()
      return res.status(400).render("account/delete-account", {
        title: "Delete Account",
        nav,
        message: "❌ Incorrect password. Please try again.",
      })
    }

    // Delete account
    const result = await accountModel.deleteAccount(accountId)
    if (result) {
      res.clearCookie("jwt") // remove token cookie
      return res.redirect("/?message=Account+deleted+successfully")
    } else {
      throw new Error("Unable to delete account. Please try again later.")
    }
  } catch (error) {
    console.error("Error deleting account:", error)
    const nav = await utilities.getNav()
    res.status(500).render("account/delete-account", {
      title: "Delete Account",
      nav,
      message: "⚠️ Something went wrong. Please try again.",
    })
  }
}

/* ****************************************
*  Render the account type update page (Admin only)
* ************************************ */
accountController.buildChangeAccountType = async (req, res) => {
  try {
    const nav = await utilities.getNav()

    // Fetch all accounts for Admin to choose from
    const accounts = await accountModel.getAllAccounts()
    res.render("account/change-account-type", {
      title: "Change Account Type",
      nav,
      accounts,
      message: null,
    })
  } catch (error) {
    console.error("Error loading change account type view:", error)
    res.status(500).send("Error loading page.")
  }
}

/* ****************************************
*  Handle account type change (Admin only)
* ************************************ */
accountController.changeAccountType = async (req, res) => {
  try {
    const { account_id, new_type } = req.body
    const nav = await utilities.getNav()

    // Simple validation
    if (!account_id || !new_type) {
      const accounts = await accountModel.getAllAccounts()
      return res.render("account/change-account-type", {
        title: "Change Account Type",
        nav,
        accounts,
        message: "⚠️ Please select an account and a new type.",
      })
    }

    const updatedAccount = await accountModel.updateAccountType(account_id, new_type)

    if (!updatedAccount) {
      const accounts = await accountModel.getAllAccounts()
      return res.render("account/change-account-type", {
        title: "Change Account Type",
        nav,
        accounts,
        message: "❌ Failed to update account type. Try again.",
      })
    }
    // Success message
    const accounts = await accountModel.getAllAccounts()
    res.render("account/change-account-type", {
      title: "Change Account Type",
      nav,
      accounts,
      message: `✅ Account ID ${account_id} updated to ${new_type}.`,
    })
  } catch (error) {
    console.error("Error changing account type:", error)
    res.status(500).render("account/change-account-type", {
      title: "Change Account Type",
      nav: await utilities.getNav(),
      accounts: await accountModel.getAllAccounts(),
      message: "⚠️ Something went wrong. Please try again.",
    })
  }
}

module.exports = accountController