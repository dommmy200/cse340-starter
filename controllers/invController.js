const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const inverterController = {}

/* ***************************
 *  Build inventory by inventory view
 * ************************** */
inverterController.buildByInventoryId = async function (req, res, next) {
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
inverterController.buildByClassificationId = async function (req, res, next) {
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

/* ***************************
 *  Build Mgt View
 * ************************** */
inverterController.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const VehicleMgtGrid = await utilities.buildVehicleManagementGrid()
    const classifications = await invModel.getClassificationsFunction()
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      messages: req.flash(),
      VehicleMgtGrid,
      classifications //pass to view
    })
  } catch (err) {
    next(err)
  }
}
/* ***************************
 *  Show Add Classification form
 * ************************** */
inverterController.showAddClassification = async function (req, res, next) {
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
inverterController.addClassification = async function (req, res, next) {
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
inverterController.showAddVehicle = async function (req, res, next) {
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
inverterController.addVehicle = async function (req, res, next) {
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
inverterController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

// Display edit form
inverterController.editInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)

  const itemData = await invModel.getItemByInventoryId(inv_id)
  if (!itemData) {
    req.flash("error", "Vehicle not found")
    return res.redirect("/inv/management")
  }

  res.render("inventory/edit-inventory", {
    title: `Edit ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    item: itemData,
    errors: null
  })
}

// Handle update form submission
inverterController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body

  const updateResult = await invModel.updateInventory(inv_id, {
    inv_make,
    inv_model,
    inv_year,
    inv_price
  })

  if (updateResult) {
    req.flash("notice", "Vehicle updated successfully")
    res.redirect("/inv/management")
  } else {
    req.flash("error", "Update failed, please try again")
    res.status(500).render("inventory/edit-inventory", {
      title: "Edit Vehicle",
      nav,
      item: req.body,
      errors: null
    })
  }
}

// controllers/inverterController.js

// Display delete confirmation page
inverterController.deleteInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.inv_id)

  const itemData = await invModel.getItemByInventoryId(inv_id)
  if (!itemData) {
    req.flash("error", "Vehicle not found")
    return res.redirect("/inv/management")
  }

  res.render("inventory/delete-confirm", {
    title: `Delete ${itemData.inv_make} ${itemData.inv_model}`,
    nav,
    item: itemData
  })
}

// Handle actual delete
inverterController.deleteInventory = async function (req, res, next) {
  const { inv_id } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    req.flash("notice", "Vehicle deleted successfully")
    res.redirect("/inv/management")
  } else {
    req.flash("error", "Delete failed, please try again")
    res.redirect("/inv/management")
  }
}


module.exports = inverterController