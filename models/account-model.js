const pool = require("../database/")

/* ***************************************************
 *  Get account email and password item by account_id
 * *************************************************** */
async function getLoginId(account_id) {
  try {
    const sql = `SELECT * FROM public.account AS i WHERE i.account_id = $1`
    const data = await pool.query(sql, [account_id]);
    console.log("Row count: ", data.rowCount, "Login Detail: ", data.rows[0])
    if (data.rowCount === 0) {
        throw new Error(`Item with ID ${account_id} not found`);
    }
    return data.rows[0];
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}
/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

module.exports = { getLoginId, registerAccount }