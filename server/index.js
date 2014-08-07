var app = require('./app');
var db = require('../models');

db
  .sequelize
  .sync({})
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      app();
    }
  });
