const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

let pool
if (process.env.NODE_ENV == "development") {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://dom340_user:NVRIrKl3uZeFqpeT1mLFRp5Y78MQ9c8t@dpg-d33umogdl3ps7396sbbg-a.frankfurt-postgres.render.com/dom340',
        ssl: {
            rejectUnauthorized: false,
        },
    })

    // Added for troubleshooting queries
    // during development
    module.exports = {
        async query(text, params) {
            try {
                const res = await pool.query(text, params)
                console.log("executed query", { text })
                return res
            } catch (error) {
                console.error("error in query", { text })
                throw error
            }
        },
    }
} else {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://dom340_user:NVRIrKl3uZeFqpeT1mLFRp5Y78MQ9c8t@dpg-d33umogdl3ps7396sbbg-a.frankfurt-postgres.render.com/dom340',
    })
    module.exports = pool
}