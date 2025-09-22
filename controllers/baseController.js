const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav();
  const hero = utilities.getHero();
  const upgrades = utilities.upgrades;
  req.flash('notice', 'This is a flash message.')
  res.render("index", {title: "Home", nav, hero, upgrades});
};

module.exports = baseController;