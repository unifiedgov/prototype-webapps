const express = require('express')
const router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Add your routes here - above the module.exports line

router.get('/admin/all-applications', function (req, res) {
  res.render('admin/all-applications', {'title':'All applications','laName':'South Bucks Council','app_class':'active'})
})

module.exports = router
