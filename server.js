/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const favicon = require('serve-favicon');
const path = require('path');
const express = require("express");
const app = express();

const env = require("dotenv").config();
const utilities = require('./utilities');
const static = require("./routes/static");
const inventoryRoute = require('./routes/inventoryRoute');
const expressLayouts = require("express-ejs-layouts");
const baseController = require('./controllers/baseController');

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);
// Favicon route
app.use(favicon(path.join(process.cwd(), 'docs', 'images', 'site', 'favicon-32x32.ico')));

// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Route to render the home page
 ************************/
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) {message: err.message} else { message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
});
