const express = require('express')
const router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Add your routes here - above the module.exports line

router.get('/admin/all-applications', function (req, res) {
  res.render('admin/all-applications', {'title':'All applications','app_class':'active'})
})

router.get('/admin/manage-users', function (req, res) {
  res.render('admin/manage-users', {'title':'Manage users','manage_class':'active'})
})

router.get('/admin/create-user', function (req, res) {
  res.render('admin/create-user', {'title':'Create a new user','manage_class':'active'})
})

module.exports = router
