const express = require('express')
const router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('index')
});

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
});

router.get('/admin/all-applications', function (req, res) {
  res.render('admin/all-applications', {'title':'All applications','app_class':'active'})
});

router.get('/admin/manage-users', function (req, res) {
  res.render('admin/manage-users', {'title':'Manage users','manage_class':'active'})
});

router.get('/admin/create-user', function (req, res) {
  res.render('admin/create-user', {'title':'Create a new user','manage_class':'active'})
});

router.get('/admin/edit-details', function (req, res) {
  res.render('admin/edit-details', {'title':'User details','manage_class':'active'})
});

router.get('/admin/remove-user', function (req, res) {
  res.render('admin/remove-user', {'title':'Remove user','manage_class':'active'})
});

// Candidate routes

router.get('/candidate', function (req, res) {
  res.locals.hideServiceName = 'yes';
  res.render('candidate/index.html')
});

router.get('/candidate/check-eligibility/', function (req, res) {
  res.render('candidate/check-eligibility/index.html', {'title':'Who are you applying for?'})
});

router.get('/candidate/check-eligibility/existing-badge/', function (req, res) {
  res.render('candidate/check-eligibility/existing-badge/index.html')
});

router.get('/candidate/check-eligibility/existing-badge/index-backend', function (req, res) {
  switch (req.session.data['renewal-or-new-application']) {
    case "renewal":
      var blueBadgeNumber = req.session.data['existing-blue-badge-number'];
      if (blueBadgeNumber.indexOf('1111') === 0 && blueBadgeNumber.lastIndexOf('1111') === blueBadgeNumber.length-4) {
        res.redirect('/candidate/check-eligibility/existing-badge/not-for-renewal');
      } else if (blueBadgeNumber.indexOf('2222') === 0 && blueBadgeNumber.lastIndexOf('2222') === blueBadgeNumber.length-4) {
        res.redirect('/candidate/check-eligibility/existing-badge/not-for-review');
      } else if (blueBadgeNumber.indexOf('3333') === 0 && blueBadgeNumber.lastIndexOf('3333') === blueBadgeNumber.length-4) {
        res.redirect('/candidate/check-eligibility/existing-badge/badge-not-found');
      } else {
        res.redirect('/candidate/check-eligibility/existing-badge/not-for-review-with-eligibility-questions');
      }
      break;
    case "new":
      res.redirect('/candidate/check-eligibility/find-your-council');
      break;
    default:
      res.redirect('/candidate/check-eligibility/find-your-council');
      break;
  }
});

router.get('/candidate/check-eligibility/existing-badge/not-for-review/', function (req, res) {
  res.locals.formAction = '/candidate/apply';
  res.render('candidate/check-eligibility/existing-badge/not-for-review.html');
});

router.get('/candidate/check-eligibility/existing-badge/not-for-review-with-eligibility-questions', function (req, res) {
  res.locals.formAction = '/candidate/check-eligibility/find-your-council';
  res.render('candidate/check-eligibility/existing-badge/not-for-review');
});


router.get('/candidate/apply', function (req, res) {
  // Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/name'))
  res.render('candidate/apply/nino')
})

module.exports = router
