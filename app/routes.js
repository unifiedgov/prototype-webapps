const express = require('express')
const router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

// Set the right pronouns
router.use(function(req, res, next) {
  console.log(req.session.data);
  var applicant = req.session.data['applicant'];
  res.locals.you = applicant === 'someone-else' ? 'they' : 'you';
  res.locals.your = applicant === 'someone-else' ? 'their' : 'your';
  res.locals.youOrThem = applicant === 'someone-else' ? 'them' : 'you';
  var application = "application";
  switch(req.session.data['renewal-or-new-application']) {
    case "new":
      application = "application";
      break;
    case "renewal":
      application = "renewal application";
      break;
    default:
      application = "application";
      break;
  }
  res.locals.application = application;
  next();
});

// Admin routes

router.get('/admin/sign-in', function (req, res) {
  res.render('admin/sign-in', {})
  req.session.destroy()
})

router.get('/admin/all-applications', function (req, res) {
  res.render('admin/all-applications', {'title':'All applications','app_class':'active'})
})

router.get('/admin/manage-users', function (req, res) {
  res.render('admin/manage-users', {'title':'Manage users','manage_class':'active'})
})

router.get('/admin/create-user', function (req, res) {
  res.render('admin/create-user', {'title':'Create a new user','manage_class':'active'})
})

router.get('/admin/edit-details', function (req, res) {
  res.render('admin/edit-details', {'title':'User details','manage_class':'active'})
})

router.get('/admin/remove-user', function (req, res) {
  res.render('admin/remove-user', {'title':'Remove user','manage_class':'active'})
})

// Candidate routes

router.get('/candidate', function (req, res) {
  res.locals.hideServiceName = 'yes';
  res.render('candidate/index.html')
})

router.get('/candidate/check-eligibility/', function (req, res) {
  res.render('candidate/check-eligibility/index.html', {'title':'Who are you applying for?'})
})

router.get('/candidate/check-eligibility/existing-badge/', function (req, res) {
  res.render('candidate/check-eligibility/existing-badge/index.html')
})

module.exports = router
