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
  let data = await invModel.getClassifications()
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

module.exports = Util