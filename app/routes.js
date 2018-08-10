const express = require('express')
const router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
});

// Stops people accidentally clearing the data
router.get('/clears-data', function (req, res) {
  res.render('clears-data')
});

router.use(function(req, res, next) {
  console.log(req.session.data);
  next();
});

module.exports = router