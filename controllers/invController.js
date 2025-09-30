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
  req.flash("notice", "Inventory loaded successfully.")
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
  req.flash("notice", "Classification loaded successfully.")
  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid
  })
}
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const VehicleMgtGrid = await utilities.buildVehicleManagementGrid()
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    messages: req.flash(),
    VehicleMgtGrid
  })
}
/* ***************************
 *  Show Add Classification form
 * ************************** */
invCont.showAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationGrid = await utilities.buildAddClassificationGrid()

  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    messages: req.flash(),
    classificationGrid
  })
}

/* ***************************
 *  Process Add Classification form
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  try {
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash("success", "New classification added successfully!")
      res.redirect("/inventory/management")
    } else {
      req.flash("error", "Failed to add classification.")
      res.redirect("/inventory/add-classification")
    }
  } catch (error) {
    console.error(error)
    req.flash("error", "An error occurred while adding classification.")
    res.redirect("/inventory/add-classification")
  }
}

/* ***************************
 *  Show Add Vehicle form
 * ************************** */
invCont.showAddVehicle = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    // const classificationList = await utilities.buildClassificationList()
    // const inventoryGrid = await utilities.buildNewVehicleGrid()
    let classifications = await invModel.getClassifications()
    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      // inventoryGrid,
      messages: req.flash(),
      classifications: classifications.rows,
    })
  } catch (error) {
    console.error("Error loading Add Vehicle form:", error)
    req.flash("error", "Could not load Add Vehicle form.")
    res.redirect("/inv/management")
  }
}

/* ***************************
 *  Process Add Vehicle form
 * ************************** */
invCont.addVehicle = async function (req, res, next) {
  const { classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color } = req.body
  try {
    const result = await invModel.addVehicle(
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    )

    if (result) {
      req.flash("success", "New vehicle added successfully!")
      res.redirect("/inventory/management")
    } else {
      req.flash("error", "Failed to add vehicle.")
      res.redirect("/inventory/add-inventory")
    }
  } catch (error) {
    console.error(error)
    req.flash("error", "An error occurred while adding vehicle.")
    res.redirect("/inventory/add-inventory")
  }
}

module.exports = invCont