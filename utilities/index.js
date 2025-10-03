const express = require('express');
const path = require('path');
const app = express();

// Serve "upgrades" folder as static files
app.use('/upgrades', express.static(path.join(process.cwd(), 'public')));
app.use('/hero', express.static(path.join(process.cwd(), 'public')));

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

// Util.getNav = async function () {
//   let data = await invModel.getClassifications()
//   let list = "<ul>"

//   // Home link
//   list += '<li><a href="/">Home</a></li>'

//   // Classification links
//   data.rows.forEach((row) => {
//     console.log("✅ getNav called");
//     list += `<li>
//       <a href="/inv/type/${row.classification_id}" 
//          title="See our inventory of ${row.classification_name} vehicles">
//          ${row.classification_name}
//       </a>
//     </li>`
//   })

//   // Vehicle Management (admin functions)
//   list += `<li><a href="/inv/management">Management</a></li>`

//   // Account links
//   list += `<li><a href="/account/login">Login</a></li>`
//   list += `<li><a href="/account/register">Register</a></li>`

//   list += "</ul>"
//   return list
// }


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
  grid += `<p>Password must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>`
  grid += `<button type="submit" id="register">Register</button>`
  grid += `<button type="button" id="togglePassword">Show Password</button>`
  grid += `</form>`
  grid += `</div>`
  grid +=  `<script src="/js/script.js" defer></script>`

  return grid;
}
Util.buildLoginGrid = async function () {

  let grid = `<form action="/account/login/test" method="POST">`
  grid += `<div class="form-group">`
  grid += '<label for="username">Enter Email</label>'
  grid += `<input type="text" id="username" name="account_email" required>`
  grid += `</div>`
  grid += `<div class="form-group">`
  grid += `<label for="password">Password</label>`
  grid += `<input type="password" id="password" name="account_password" required>`
  grid += `<p>Password must be minimum of 12 characters and include 1 capital letter, 1 number, and 1 special character.</p>`
  grid += `<button id='togglePassword'>Show Password</button>`
  grid += `</div>`
  grid += `<button type="submit">Log In</button>`
  grid += `<div class="signup-link">`
  grid += `<p>No Account? <a href="/account/register">Sign Up Here!</a></p>`
  grid += `</div>`
  grid +=  `</form>`
  grid +=  `<script src="/js/script.js" defer></script>`
  
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
  <form action="/inv/add-vehicle" method="POST" class="container mt-4">

  <!-- Classification -->
  <div class="mb-3">
    <label for="classification_id" class="form-label">Classification</label>
    <select name="classification_id" id="classification_id" class="form-select" required>
      <option value="">-- Choose Classification --</option>
      <% classifications.forEach(classification => { %>
        <option value="<%= classification.classification_id %>">
          <%= classification.classification_name %>
        </option>
      <% }) %>
    </select>
  </div>

  <!-- Make -->
  <div class="mb-3">
    <label for="inv_make" class="form-label">Make</label>
    <input 
      type="text" 
      name="inv_make" 
      id="inv_make" 
      class="form-control"
      placeholder="Enter vehicle make (min 3 chars)" 
      minlength="3" 
      required
    >
  </div>

  <!-- Model -->
  <div class="mb-3">
    <label for="inv_model" class="form-label">Model</label>
    <input 
      type="text" 
      name="inv_model" 
      id="inv_model" 
      class="form-control"
      placeholder="Enter vehicle model (min 3 chars)" 
      minlength="3" 
      required
    >
  </div>

  <!-- Description -->
  <div class="mb-3">
    <label for="inv_description" class="form-label">Description</label>
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
  <div class="mb-3">
    <label for="inv_image" class="form-label">Image Path</label>
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
  <div class="mb-3">
    <label for="inv_thumbnail" class="form-label">Thumbnail Path</label>
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
  <div class="mb-3">
    <label for="inv_price" class="form-label">Price</label>
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
  <div class="mb-3">
    <label for="inv_year" class="form-label">Year</label>
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
  <div class="mb-3">
    <label for="inv_miles" class="form-label">Miles</label>
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
  <div class="mb-3">
    <label for="inv_color" class="form-label">Color</label>
    <input 
      type="text" 
      name="inv_color" 
      id="inv_color" 
      class="form-control"
      placeholder="Enter vehicle color" 
      required
    >
  </div>

  <!-- Submit -->
  <button type="submit" class="btn btn-primary">Add Vehicle</button>
</form>

  `
  return inventoryGrid
}

Util.buildVehicleManagementGrid = async function () {
  let MgtGrid = `
   <ul>
      <li><a href="/inv/add-classification">Add New Classification</a></li>
      <li><a href="/inv/add-inventory">Add New Vehicle</a></li>
    </ul>
  `
  return MgtGrid
}

Util.loginSuccessGrid = async () => {
  let successGrid = `
  <p>You're logged in successfully!</p>`
  return successGrid
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

module.exports = Util