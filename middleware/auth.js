const jwt = require("jsonwebtoken")

function checkAuth(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "You must be logged in to view this page.")
    return res.redirect("/account/login")
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.accountData = decoded // attach user data for later use
    next()
  } catch (err) {
    console.error("JWT verification failed:", err.message)
    res.clearCookie("jwt")
    req.flash("notice", "Session expired. Please log in again.")
    return res.redirect("/account/login")
  }
}

/* Middleware to check JWT and set account info */
function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    res.locals.account = null;
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, accountData) => {
    if (err) {
      console.error("JWT verification error:", err);
      res.locals.account = null;
      return next();
    }

    res.locals.account = accountData;
    next();
  });
};

module.exports = { checkAuth, checkJWTToken  }
