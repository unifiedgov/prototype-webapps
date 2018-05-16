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

router.get('/admin/order-a-badge', function (req, res) {
  req.session.data['nino'] = undefined;
  req.session.data['first-name'] = undefined;
  req.session.data['last-name'] = undefined;
  req.session.data['dob-day'] = undefined;
  req.session.data['dob-month'] = undefined;
  req.session.data['dob-year'] = undefined;
  req.session.data['gender'] = undefined;
  req.session.data['address-line-1'] = undefined;
  req.session.data['address-line-2'] = undefined;
  req.session.data['address-town'] = undefined;
  req.session.data['address-postcode'] = undefined;
  req.session.data['la-reference'] = undefined;
  req.session.data['start-day'] = undefined;
  req.session.data['start-month'] = undefined;
  req.session.data['start-year'] = undefined;
  req.session.data['expiry-day'] = undefined;
  req.session.data['expiry-month'] = undefined;
  req.session.data['expiry-year'] = undefined;
  req.session.data['deliver-to'] = undefined;
  req.session.data['postage'] = undefined;
  res.render('admin/order-a-badge', {'title':'Order a badge','order_class':'active', 'formAction':'/admin/order-a-badge/processing'})
});

router.get('/admin/order-a-badge-change', function (req, res) {
  res.render('admin/order-a-badge', {'title':'Order a badge','order_class':'active', 'formAction':'/admin/order-a-badge/check-order'})
});

router.get('/admin/order-a-badge/processing', function (req, res) {
  var todayDate = new Date();
  var startDay = todayDate.getDate();
  var startMonth = todayDate.getMonth()+1; //January is 0!
  var startYear = todayDate.getFullYear();
  var expiryDatePlus3Years = new Date(new Date().setFullYear(new Date().getFullYear() + 3));
  var expiryDate = new Date(expiryDatePlus3Years.setDate(expiryDatePlus3Years.getDate() - 1));
  var expiryDay = expiryDate.getDate();
  var expiryMonth = expiryDate.getMonth()+1; // January is 0!
  var expiryYear = expiryDate.getFullYear();

  res.render('admin/processing', {'title':'Processing','order_class':'active',
    'startDay': startDay, 'startMonth': startMonth, 'startYear': startYear,
    'expiryDay': expiryDay, 'expiryMonth': expiryMonth, 'expiryYear': expiryYear
  });
});

router.get('/admin/order-a-badge/check-order', function (req, res) {
  res.render('admin/check-order', {'title':'Check order','order_class':'active'})
})

router.get('/admin/order-a-badge/badge-ordered', function (req, res) {
  req.session.destroy();
  res.render('admin/badge-ordered', {'order_class':'active'})
})

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

router.get('/candidate/check-eligibility/existing-badge/badge-not-found-backend', function (req, res) {
  switch (req.session.data['badge-not-found-how-to-proceed']) {
    case "reenter":
      res.redirect('/candidate/check-eligibility/existing-badge');
      break;
    case "new":
      req.session.data['renewal-or-new-application'] = 'new';
      res.redirect('/candidate/check-eligibility/find-your-council');
      break;
    case "renewal":
      req.session.data['renewal-or-new-application'] = 'renewal';
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

router.get('/candidate/check-eligibility/disability', function (req, res) {
  if (req.query.benefit === 'none') {
    res.render('candidate/check-eligibility/disability');
  } else {
    res.redirect('/candidate/check-eligibility/decision');
  }
});


// Apply

function sendBackToCheckAnswers(query, nextAction) {
  console.log("called");
  var locals;
  if (query.change === 'true') {
    console.log('true');
    locals = {
      'formAction': 'candidate/apply/check-answers',
      'submitLabel': 'Update'
    }
  } else {
    console.log('false');
    locals = {
      'formAction': nextAction,
      'submitLabel': 'Continue'
    }
  }
  return locals;
}

router.get('/candidate/apply', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/name'))
  res.render('candidate/apply/nino')
})

router.get('/candidate/apply/name', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/dob'))
  res.render('candidate/apply/name')
})

router.get('/candidate/apply/dob', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/gender'))
  res.render('candidate/apply/dob')
})

router.get('/candidate/apply/gender', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/select-address'))
  res.render('candidate/apply/gender')
})

router.get('/candidate/apply/select-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/contact'))
  res.render('candidate/apply/select-your-address')
})

router.get('/candidate/apply/enter-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/contact'))
  res.render('candidate/apply/enter-your-address')
})

router.get('/candidate/apply/contact', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/prove-your-identity'))
  res.render('candidate/apply/contact-details')
})

router.get('/candidate/proof-backend', function (req, res) {
    if (req.query.change==='true') {
      res.redirect('/candidate/apply/check-answers');
    } else {
    if (req.session.data['benefit'] === 'none'
        && req.session.data['disability']
        && req.session.data['disability'].includes('problems-walking')) {
      res.redirect('/candidate/prove-eligibility/how-long-can-you-walk-for');
    } else if (req.session.data['benefit'] === 'dla' || req.session.data['benefit'] === 'pip') {
      res.redirect('/candidate/eligibility-proof/provide-proof-of-your-eligibility');
    } else {
      res.redirect('/candidate/eligibility-proof/provide-proof-of-your-eligibility');
    }
  }
});

router.get('/candidate/eligibility-proof/provide-proof-of-your-eligibility', function(req, res) {
  res.locals.formAction = '/candidate/eligibility-proof/upload-proof-of-your-eligibility';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  var question1 = '';
  var question3 = '';
  var applicant = req.session.data['applicant'];
  var you = applicant === 'someone-else' ? 'they' : 'you';
  var your = applicant === 'someone-else' ? 'their' : 'your';
  switch(req.session.data['benefit']) {
    case "dla":
      question1 = 'Have ' + you + ' been awarded the Disability Living Allowance, indefinitely?';
      question3 = 'You must provide a copy of your letter of entitlement, issued within the last twelve months. How would you like to provide this?'
      break;
    case "pip":
      question1 = 'Have ' + you + ' been awarded the Personal Independence Payment, indefinitely?';
      question3 = 'You must provide a copy of your decision letter or your annual uprating letter, issued within the last twelve months. How would you like to provide this?';
      break;
    default:
      question1 = 'Have ' + you + ' been awarded the Personal Independence Payment, indefinitely?';
      question3 = 'You must provide a copy of your decision letter or your annual uprating letter, issued within the last twelve months. How would you like to provide this?';
      break;
  }
  res.locals.question1 = question1;
  res.locals.question3 = question3;
  req.session.data['benefit-proof-file-upload'] = undefined;
  req.session.data['benefit-proof-file'] = undefined;
  res.render('candidate/eligibility-proof/provide-proof-of-your-eligibility');
});

router.get('/candidate/eligibility-proof/upload-proof-of-your-eligibility', function (req, res) {
  if (req.query.change === 'true') {
    res.locals.formAction = '/candidate/apply/check-answers';
  } else {
    res.locals.formAction = '/candidate/apply/prove-your-address';
  }
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render('candidate/eligibility-proof/upload-proof-of-your-eligibility')
});

router.get('/candidate/apply/prove-your-identity', function (req, res) {
  res.locals.formAction = '/proof-backend';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render('candidate/apply/prove-your-identity')
})

router.get('/candidate/apply/prove-your-address', function (req, res) {
  if ((req.query.change !== 'true') &&
     (req.session.data['identity-upload-shows-current-address'] === 'yes' ||
      req.session.data['benefit-proof-upload-shows-current-address'] === 'yes' ||
      req.session.data['identity-verified'] === 'yes')) {
    res.redirect('/candidate/apply/provide-photo');
  } else {
    res.locals.formAction = '/candidate/apply/prove-your-address-backend';
    console.log('formAction=' + res.locals.formAction);
    res.locals.submitLabel = 'Continue';
    res.locals.change = req.query.change;
    res.render('candidate/apply/prove-your-address');
  }
})

router.get('/candidate/apply/prove-your-address-backend', function (req, res) {
  if (req.query.change === 'true') {
    res.redirect('/candidate/apply/check-answers');
  } else {
    res.redirect('/candidate/apply/provide-photo');
  }
});

router.get('/candidate/apply/provide-photo', function (req, res) {
//  res.locals.formAction = '/candidate/apply/provide-photo-2';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render('candidate/apply/provide-photo');
})

router.get('/candidate/apply/upload-your-photo', function (req, res) {
  res.render('candidate/apply/upload-your-photo');
});

router.get('/candidate/apply/prove-benefit', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/check-answers'))
  res.render('candidate/apply/prove-benefit')
})

router.get('/candidate/apply/check-answers', function (req, res) {
  res.render('candidate/apply/check-answers'); //, {'formAction':'/candidate/apply/paying-for-your-blue-badge'})
})

router.get('/candidate/apply/paying-for-your-blue-badge', function(req, res) {
  res.render('candidate/apply/paying-for-your-blue-badge');
});

router.get('/candidate/apply/paying-for-your-blue-badge-backend', function(req, res) {
  if (req.query['pay-when'] === 'later') {
    //res.redirect('/candidate/apply/check-answers');
    res.redirect('/candidate/apply/confirmation');
  } else {
    req.session.data['pay-when'] = 'now';
    res.redirect('https://production-1-production-pay-products-ui.cloudapps.digital/pay/a9e0f2ce1f7148ef879bdc1fa04ba652');
  };
});

router.get('/candidate/apply/declaration', function (req, res) {
  res.render('candidate/apply/declaration', {'formAction':'/candidate/apply/complete'})
})

router.get('/candidate/apply/confirmation', function (req, res) {
  res.render('candidate/apply/confirmation')
})

router.get('/version-history', function(req, res) {
  res.render('version-history');
});


module.exports = router
