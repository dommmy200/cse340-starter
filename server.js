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

app.use((req, res, next) => {
  res.locals = {
    images: "/images/site/icon.png",
    year: new Date().getFullYear(),
    siteName: "CSE Motors",
  };
  next();
});
/* ***********************
 * Routes
 *************************/
app.use(static);
// Favicon route
app.use(favicon(path.join(process.cwd(), 'public',  'favicon-32x32.ico')));
app.use(express.static(path.join(process.cwd(), 'public')));

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
// app.use(async (err, req, res, next) => {
  //   let nav = await utilities.getNav()
  //   console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  //   if (err.status == 404) {message: err.message} else { message = 'Oh no! There was a crash. Maybe try a different route?'}
  //   res.render("errors/error", {
    //     title: err.status || 'Server Error',
    //     message: err.message,
    //     nav
    //   })
    // })

/* ************************************************
* Enhanced and more general Express Error Handler *
***************************************************/
app.use(async (err, req, res, next) => {
  try {
    // Build any shared UI elements (navigation, footer, etc.)
    const nav = await utilities.getNav();
    const footer = utilities.getFooter?.(); // Example: optional footer helper

    // Log the error for debugging
    console.error(`Error at "${req.originalUrl}":`, err);

    // Decide on status and user-facing message
    let status = err.status || 500;
    let message;

    switch (status) {
      case 400:
        message = "Bad Request. Please check your input.";
        break;
      case 401:
        message = "Unauthorized. Please log in to continue.";
        break;
      case 403:
        message = "Forbidden. You don't have permission to view this resource.";
        break;
      case 404:
        message = err.message || "Page not found.";
        break;
      case 500:
      default:
        message = err.message || "Oh no! There was a crash. Please try again.";
        break;
    }

    // Render custom error view
    res.status(status).render("errors/error", {
      title: `${status} Error`,
      message,
      nav,
      footer: `${status} Error`, // Other shared elements like footer, header... can be included
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  } catch (handlerError) {
    // If something fails *inside* the error handler itself
    console.error("Error while handling error:", handlerError);
    res
      .status(500)
      .send("Critical failure while handling an error. Please try later.");
  }
});

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
