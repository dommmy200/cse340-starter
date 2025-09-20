const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
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

module.exports = {getClassifications, getInventoryByClassificationId, getItemByInventoryId}