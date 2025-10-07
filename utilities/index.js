const express = require('express');
const path = require('path');
const app = express();

// Serve "upgrades" folder as static files
app.use('/upgrades', express.static(path.join(process.cwd(), 'public')));
app.use('/hero', express.static(path.join(process.cwd(), 'public')));

const { body } = require("express-validator")
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  
  // Dynamically construct the unordered list with info from the fetched data
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
};

Util.getHero = function (req, res, next) {
   const hero = {
            title: 'Welcome to CSE Motors!',
            alt: 'Delorean',
            image: '/images/vehicles/delorean.jpg'
        }
    return hero;
}

Util.getFooter = function (req, res, next) {
  const d = new Date()
  let year = d.getFullYear()
  const list = `
        <div class="copyright">
          <img src="/images/site/icon.png" alt="Site image">
          <div>
            <span>&copy${year}</span><span> | CSE 340 App</span>
          </div>
        </div>`
  return list;
}

Util.upgrades = [
    {upgrade: '/images/upgrades/flux-cap.png', alt: 'Flux Capacitor'},
    {upgrade: '/images/upgrades/flame.jpg', alt: 'Flame Decals'},
    {upgrade: '/images/upgrades/bumper-sticker.jpg', alt: 'Bumper Stickers'},
    {upgrade: '/images/upgrades/hub-cap.jpg', alt: 'Hub Caps'}
  ];

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
      grid += '<hr />'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
/* ***********************************
* Build Individual Vehicle View HTML
************************************ */
Util.buildInventoryItemGrid = async function (item) {
  if (!item) {
    return '<p>No inventory item found.</p>';
  }

  let grid = '<section class="inventory-item">';
  grid += `<img src="${item.inv_image}" alt="${item.inv_make} ${item.inv_model}">`;
  grid += '<div class="item-detail">';
  grid += `<p>${item.inv_make} ${item.inv_model} Details</p>`;
  grid += `<p>Price: $${new Intl.NumberFormat('en-US').format(item.inv_price)}</p>`;
  grid += `<p>Description: ${item.inv_description}</p>`;
  grid += `<p>Color: ${item.inv_color}</p>`;
  grid += `<p>Miles: ${item.inv_miles}</p>`;
  grid += '</div>';
  grid += '</section>';

  return grid;
}
/* ***********************************
* Build Login View HTML
************************************ */
Util.buildRegisterGrid = async function () {

  let grid = `<div class="register">`
  grid += `<h2>ALL FIELDS ARE REQUIRED</h2>`
  grid +=`<form action="/account/register" method="post">`
  grid += `<div class="form-group">`
  grid += '<label for="firstname">First Name</label>'
  grid += `<input type="text" id="firstname" name="account_firstname" required>`
  grid += `</div>`
  grid += `<div class="form-group">`
  grid += '<label for="lastname">Last Name</label>'
  grid += `<input type="text" id="lastname" name="account_lastname" required>`
  grid += `</div>`
  grid += `<div class="form-group">`
  grid += '<label for="username">Email</label>'
  grid += `<input type="email" id="username" name="account_email" required>`
  grid += `</div>`
  grid += `<div class="form-group">`
  grid += `<label for="password">Password</label>`
  grid += `<input type="password" id="password" class="password" name="account_password" required>`
  grid += `</div>`
  grid += `<p class="requirement">Password must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>`
  grid += `<button type="submit" id="register">Register</button>`
  grid += `<button type="button" id="togglePassword">Show Password</button>`
  grid += `</form>`
  grid += `</div>`
  grid +=  `<script src="/js/script.js" defer></script>`

  return grid;
}
Util.buildLoginGrid = async function () {

  let grid = `
<div class="login-form-wrapper">
  <div class="login-form-card">
    <h2>Login</h2>
    <form action="/account/login/test" method="POST">
      <div class="form-group">
        <label for="username">Enter Email</label>
        <input type="text" id="username" name="account_email" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="account_password" required>
        </div>
        <p>Password must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>
        <button id="togglePassword">Show Password</button>
      <button type="submit">Log In</button>
      <div class="signup-link">
        <p>No Account? <a href="/account/register">Sign Up Here!</a></p>
      </div>
    </form>
  </div>
</div>
<script src="/js/script.js" defer></script>`

  
  return grid;
}

Util.buildAddClassificationGrid = async function () {
  let grid = `
    <form action="/inv/add-classification" method="POST">
      <label for="classification_name">Classification Name:</label>
      <input type="text" name="classification_name" id="classification_name" required>
      <button type="submit">Add Classification</button>
    </form>
  `
  return grid
}

Util.buildNewVehicleGrid = async function () {
  let inventoryGrid = `
  <div class="vehicle-form-wrapper">
    <div class="vehicle-form-card">
      <h2 class="form-title">Add New Vehicle</h2>
      <form action="/inv/add-vehicle" method="POST">
        
        <!-- Classification -->
        <div class="form-group">
          <label for="classification_id">Classification</label>
          <select name="classification_id" id="classification_id" required>
            <option value="">-- Choose Classification --</option>
            <% classifications.forEach(classification => { %>
              <option value="<%= classification.classification_id %>">
                <%= classification.classification_name %>
              </option>
            <% }) %>
          </select>
        </div>

        <!-- Make -->
        <div class="form-group">
          <label for="inv_make">Make</label>
          <input type="text" name="inv_make" id="inv_make" placeholder="Enter vehicle make" minlength="3" required>
        </div>

        <!-- Model -->
        <div class="form-group">
          <label for="inv_model">Model</label>
          <input type="text" name="inv_model" id="inv_model" placeholder="Enter vehicle model" minlength="3" required>
        </div>

        <!-- keep the rest of your fields here... -->
        <!-- Description -->
  <div class="form-group">
    <label for="inv_description" >Description</label>
    <textarea 
      name="inv_description" 
      id="inv_description" 
      class="form-control"
      rows="4"
      placeholder="Enter vehicle description" 
      required
    ></textarea>
  </div>

  <!-- Image Path -->
  <div class="form-group">
    <label for="inv_image" >Image Path</label>
    <input 
      type="text" 
      name="inv_image" 
      id="inv_image" 
      class="form-control"
      value="/images/vehicle/no-image.png"
      required
    >
  </div>

  <!-- Thumbnail Path -->
  <div class="form-group">
    <label for="inv_thumbnail" >Thumbnail Path</label>
    <input 
      type="text" 
      name="inv_thumbnail" 
      id="inv_thumbnail" 
      class="form-control"
      value="/images/vehicle/no-image.png"
      required
    >
  </div>

  <!-- Price -->
  <div class="form-group">
    <label for="inv_price" >Price</label>
    <input 
      type="number" 
      name="inv_price" 
      id="inv_price" 
      class="form-control"
      placeholder="Enter price (integer or decimal)" 
      step="0.01"
      required
    >
  </div>

  <!-- Year -->
  <div class="form-group">
    <label for="inv_year" >Year</label>
    <input 
      type="number" 
      name="inv_year" 
      id="inv_year" 
      class="form-control"
      placeholder="4-digit year" 
      min="1900" 
      max="2099" 
      required
    >
  </div>

  <!-- Miles -->
  <div class="form-group">
    <label for="inv_miles" >Miles</label>
    <input 
      type="number" 
      name="inv_miles" 
      id="inv_miles" 
      class="form-control"
      placeholder="Enter mileage (digits only)" 
      min="0" 
      required
    >
  </div>

  <!-- Color -->
  <div class="form-group">
    <label for="inv_color" >Color</label>
    <input 
      type="text" 
      name="inv_color" 
      id="inv_color" 
      class="form-control"
      placeholder="Enter vehicle color" 
      required
    >
  </div>

        <button type="submit" class="btn-submit">Add Vehicle</button>
      </form>
    </div>
  </div>
  `
  return inventoryGrid
}



Util.buildVehicleManagementGrid = async function () {
  let MgtGrid = `
  <div class="vehicle-mgt-cards">
  <a href="/inv/add-classification" class="mgt-card">
  <h3>➕ Add New Classification</h3>
  <p>Create a new classification for vehicles.</p>
  </a>
  <a href="/inv/add-inventory" class="mgt-card">
  <h3>Add New Vehicle</h3>
  <p>Register a new vehicle into inventory.</p>
  </a>
  </div>
  `
  return MgtGrid
}

Util.loginSuccessGrid = async () => {
  let successGrid = `
  <div class="login-success-container">
  <div class="login-success-card">
  <h2> Success!</h2>
  <p>You're logged in successfully!</p>
  </div>
  </div>
  `
  return successGrid
}
Util.logoutGrid = async () => {
  let logoutGridGrid = `
  <div class="logout">
  <a href="/" class="mgt-card">
  <h3>Logout</h3>
  </a>
  </div>
  `
  return logoutGridGrid
}

/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Validation for updating account info
Util.updateAccountRules = [
  body("account_firstname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long."),
  body("account_lastname")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long."),
  body("account_email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .custom(async (value, { req }) => {
      const account = await accountModel.getAccountByEmail(value)
      if (account && account.account_id != req.body.account_id) {
        throw new Error("This email is already in use by another account.")
      }
    }),
]
// Validation for changing password
Util.passwordChangeRules = [
  body("new_password")
    .trim()
    .isLength({ min: 12 })
    .withMessage("Password must be at least 12 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character."),
  body("confirm_password")
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Passwords do not match.")
      }
      return true
    }),
]
module.exports = Util