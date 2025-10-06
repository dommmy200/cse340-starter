const jwt = require("jsonwebtoken");

/**
 * Middleware to check if user has Employee or Admin privileges.
 */
function requireEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt;

  // No token? Redirect to login
  if (!token) {
    req.flash("notice", "You must be logged in as an employee or admin to access that area.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Ensure account type exists and is Employee or Admin
    const accountType = decoded.account_type;
    if (accountType === "Employee" || accountType === "Admin") {
      res.locals.account = decoded; // make it available to views
      return next();
    } else {
      req.flash("notice", "Access denied. Employee or Admin privileges required.");
      return res.redirect("/account/login");
    }

  } catch (err) {
    console.error("JWT verification failed:", err.message);
    req.flash("notice", "Invalid session. Please log in again.");
    res.clearCookie("jwt");
    return res.redirect("/account/login");
  }
}

module.exports = requireEmployeeOrAdmin;
