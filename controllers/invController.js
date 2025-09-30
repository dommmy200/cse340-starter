const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const invId = parseInt(req.params.invId, 10); // Convert to integer
  console.log(invId);
  const data = await invModel.getItemByInventoryId(invId);
  const itemGrid = await utilities.buildInventoryItemGrid(data);
  let nav = await utilities.getNav();
  const className =  `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
  res.render("./inventory/item", {
    title: className,
    nav,
    itemGrid
  })
}
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid
  })
}

module.exports = invCont