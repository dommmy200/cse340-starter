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
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1'
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
/* *****************************
* Return account data using lastname
* ***************************** */
// async function getAllAccounts() {
//   const result = await pool.query("SELECT * FROM public.account ORDER BY account_lastname")
//   return result.rows
// }
/* ****************************************
*  Get all accounts
* ************************************ */
async function getAllAccounts() {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM public.account ORDER BY account_id"
    )
    return result.rows
  } catch (error) {
    console.error("getAllAccounts error:", error)
    throw error
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountById (account_id) {
  try {
    const sql = 'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1'
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching Id found")
  }
}
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE public.account
      SET account_firstname = $1,
          account_lastname = $2,
          account_email = $3
      WHERE account_id = $4
      RETURNING *;
    `
    const result = await pool.query(sql, [firstname, lastname, email, account_id])
    return result.rowCount > 0 ? result.rows[0] : null
  } catch (error) {
    console.error("updateAccount error:", error)
    throw error
  }
}
async function updatePassword(account_id, hashedPassword) {
  const result = await pool.query(
    `UPDATE public.account
     SET account_password = $1
     WHERE account_id = $2`,
    [hashedPassword, account_id]
  )
  return result.rowCount
}

/* ******************************************************
*  Additional Enhancements:  Deletion process
*********************************************************/
async function deleteAccount(accountId) {
  try {
    const result = await pool.query(
      "DELETE FROM public.account WHERE account_id = $1 RETURNING account_id",
      [accountId]
    );
    return result.rowCount > 0;
  } catch (error) {
    console.error("deleteAccount error:", error);
    throw error;
  }
}
/* ****************************************
*  Update account type (Admin only)
* ************************************ */
async function updateAccountType(accountId, newType) {
  try {
    const result = await pool.query(
      // "UPDATE public.account SET account_type = $1 WHERE account_id = $2 RETURNING *",
      "UPDATE public.account SET account_type = $1 WHERE account_id = $2 RETURNING account_id, account_type",
      [newType, accountId]
    )
    return result.rows[0]
  } catch (error) {
    console.error("updateAccountType error:", error)
    throw error
  }
}
module.exports = { getLoginId, registerAccount, getAccountByEmail, getAccountById, updateAccount, updatePassword, deleteAccount, updateAccountType, getAllAccounts }