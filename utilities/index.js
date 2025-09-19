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
  // show the returned data in the terminal
  console.log(data);
  
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
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
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
Util.buildInventoryItemGrid = async function (data) {
  let item = data.row[0]
  let grid;
  if (grid.length > 0) {
    grid = '<section class="inventory-item">'
    grid += '<img src="'+ item.inv_image + 'alt="'+ item.inv_make + ' ' + item.inv_model +'">'
    grid += '<div class="item-detail>'
    grid += '<h1>'+ item.inv_make + ' ' + item.inv_model +' Details</h1>'
    grid += '<p>Price:' + item.inv_price +'</p>'
    grid += '<p>Description:' + inv_description + '</p>'
    grid += '<p>Color:' + inv_color + '</p>'
    grid += '<p>Miles:' + inv_miles + '</p>'
    grid += '</div>'
    grid += '</section>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid;
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util