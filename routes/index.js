/**
 * This module is built to get the primary homepage.
 * It was taken from the myExpressApp resource example.
 * The reason I used it is that it helped keep the app.js file short, and easy to read.
 */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;
