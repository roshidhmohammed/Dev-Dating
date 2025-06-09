const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (isAuthorized) {
    next();
  } else {

      res.status(401).send("Not Authorized");
  }
}

module.exports= {
    adminAuth
}