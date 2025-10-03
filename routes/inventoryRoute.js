// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const { vehicleValidationRules, checkInventoryValidation } = require("../validators/inventory-validation")
const { classificationValidationRules, checkClassificationValidation } = require("../validators/classification-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build individual inventory by inventory view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Management view
router.get("/management", utilities.handleErrors(invController.buildManagementView))

// Add Classification
router.get("/add-classification", utilities.handleErrors(invController.showAddClassification))
router.post("/add-classification",  checkClassificationValidation, utilities.handleErrors(invController.addClassification))

// Add Vehicle
router.get("/add-inventory", utilities.handleErrors(invController.showAddVehicle))
router.post("/add-inventory", checkInventoryValidation, utilities.handleErrors(invController.addVehicle))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.post("/update", utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteInventoryView))
router.post("/delete", utilities.handleErrors(invController.deleteInventory))



module.exports = router;