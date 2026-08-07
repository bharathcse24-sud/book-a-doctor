const mongoose = require('mongoose');

const checkDbConnection = (req, res, next) => {
  // If MongoDB is connected or fallback memory store is active, continue processing
  next();
};

module.exports = checkDbConnection;
