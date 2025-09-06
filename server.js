/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const app = express()

const env = require("dotenv").config()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

/* ***********************
 * Route to render the home page
 ************************/
app.get("/", (req, res) => {
  res.render("index", {
    title: "Home",
    hero: {
      title: "Welcome to CSE Motors!",
      alt: "Delorean",
      image: "/images/vehicles/delorean.jpg",
    },
    upgrades: [
        {upgrade: "/images/upgrades/flux-cap.png", alt: "Flux Capacitor"},
        {upgrade: "/images/upgrades/flame.jpg", alt: "Flame Decals"},
        {upgrade: "/images/upgrades/bumper-sticker.jpg", alt: "Bumper Stickers"},
        {upgrade: "/images/upgrades/hub-cap.jpg", alt: "Hub Caps"},
      ]
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
})
