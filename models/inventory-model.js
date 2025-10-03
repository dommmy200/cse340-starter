const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
/* ***************************
 *  Get all classification data (Another flavor)
 * ************************** */
async function getClassificationsFunction(){
  const result = await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
  return  result.rows
}

/* **********************************************************************
 *  Get all inventory items and classification_name by classification_id
 * ******************************************************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
/* **********************************************************************
 *  Get individual inventory item by inv_id
 * ******************************************************************** */
async function getItemByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.inv_id = $1`,
      [inv_id]
    );
    console.log("Row count: ", data.rowCount, "Inventory Item: ", data.rows[0])
    if (data.rowCount === 0) {
    throw new Error(`Item with ID ${inv_id} not found`);
  }
    return data.rows[0];
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

/***************************
  Update inventory item
****************************/
async function updateInventory(inv_id, data) {
  try {
    const sql = `
      UPDATE inventory
      SET inv_make = $1,
          inv_model = $2,
          inv_year = $3,
          inv_price = $4
      WHERE inv_id = $5
      RETURNING *
    `
    const params = [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_price,
      inv_id,
    ]

    const result = await pool.query(sql, params)
    return result.rowCount > 0
  } catch (error) {
    console.error("updateInventory error:", error)
    throw error
  }
}

/*************************
  Delete inventory item
**************************/
async function deleteInventory(inv_id) {
  try {
    const sql = `DELETE FROM inventory WHERE inv_id = $1`
    const result = await pool.query(sql, [inv_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("deleteInventory error:", error)
    throw error
  }
}


/* ***************************
*  Insert new classification
* ************************** */
async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO classification (classification_name)
    VALUES ($1)
    RETURNING *`
    const data = await pool.query(sql, [classification_name])
    return data.rows[0] // return inserted row
  } catch (error) {
    console.error("Error inserting classification:", error)
    return null
  }
}
/* ***************************
*  Insert new vehicle
* ************************** */
async function addVehicle(
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
) {
  try {
    const sql = `INSERT INTO inventory 
    (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`
    const data = await pool.query(sql, [
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
])
return data.rows[0]
} catch (error) {
  console.error("Error inserting vehicle:", error)
  return null
}
}

module.exports = {
  getClassifications,
  getClassificationsFunction,
  getInventoryByClassificationId,
  getItemByInventoryId,
  addClassification,
  addVehicle,
  updateInventory,
  deleteInventory
}