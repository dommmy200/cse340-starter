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
  grid += '<label for="username">Username</label>'
  grid += `<input type="text" id="username" name="account_email" required>`
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

  let grid = `<form action="/login" method="post">`
  grid += `<div class="form-group">`
  grid += '<label for="username">Username</label>'
  grid += `<input type="text" id="username" name="account_email" required>`
  grid += `</div>`
  grid += `<div class="form-group">`
  grid += `<label for="password">Password</label>`
  grid += `<input type="password" id="password" name="account_password" required>`
  grid += `</div>`
  grid += `<button type="submit">Log In</button>`
  grid += `<div class="signup-link">`
  grid += `<p>Don't have an account? <a href="/account/register">Sign up here</a></p>`
  grid += `</div>`
  grid +=  `</form>`
  
  return grid;
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util