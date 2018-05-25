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
  res.locals.my = applicant === 'someone-else' ? 'their' : 'my';
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
  res.render('admin/sign-in', {'title':'Sign in'})
  req.session.destroy()
});

router.get('/admin/', function (req, res) {
  res.redirect('admin/sign-in');
});

router.get('/admin/reset-password', function (req, res) {
  req.session.data['show'] = undefined;
  res.render('admin/reset-password', {'title':'Reset your password'})
});

router.get('/admin/reset-email-sent', function (req, res) {
  res.render('admin/reset-email-sent', {'title':'Link sent'})
});

router.get('/admin/link-expired', function (req, res) {
  res.render('admin/link-expired', {'title':'Link expired'})
});

router.get('/admin/set-your-password', function (req, res) {
  res.render('admin/set-your-password', {'title':'Set your password'})
});

router.get('/admin/all-applications', function (req, res) {
  res.render('admin/all-applications', {'title':'All applications','app_class':'active'})
});

router.get('/admin/manage-users', function (req, res) {
  req.session.data['success'] = undefined;
  res.render('admin/manage-users', {'title':'Manage users','manage_class':'active'})
});

router.get('/admin/users-results', function (req, res) {
  res.locals.searchValue = req.session.data['search-box'];
  res.render('admin/users-results', {'title':'Manage users','manage_class':'active'})
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
  req.session.data = undefined;
  res.render('admin/order-a-badge/index', {'title':'Order a badge','order_class':'active', 'formAction':'/admin/order-a-badge/details'})
});

router.get('/admin/order-a-badge/details', function (req, res) {
  if (req.session.data['badge-type'] === 'person') {
    res.locals.title = 'Personal details';
  } else {
    res.locals.title = 'Organisation details';
  }

  res.render('admin/order-a-badge/details', {'order_class':'active', 'formAction':'/admin/order-a-badge/processing'});
});

router.get('/admin/order-a-badge/change-details', function (req, res) {
  if (req.session.data['badge-type'] === 'person') {
    res.locals.title = 'Personal details';
  } else {
    res.locals.title = 'Organisation details';
  }
  res.render('admin/order-a-badge/details', {'title':'Order a badge','order_class':'active', 'formAction':'/admin/order-a-badge/check'})
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

  res.render('admin/order-a-badge/processing', {'title':'Processing','order_class':'active',
    'startDay': startDay, 'startMonth': startMonth, 'startYear': startYear,
    'expiryDay': expiryDay, 'expiryMonth': expiryMonth, 'expiryYear': expiryYear
  });
});

router.get('/admin/order-a-badge/check', function (req, res) {
  res.render('admin/order-a-badge/check', {'title':'Check order','order_class':'active'})
})

router.get('/admin/order-a-badge/badge-ordered', function (req, res) {
  req.session.destroy();
  res.render('admin/badge-ordered', {'order_class':'active'})
})

router.get('/admin/search-for-a-badge', function (req, res) {
  res.render('admin/search-for-a-badge', {'title':'Find a badge','search_class':'active'})
})

router.get('/admin/search-results', function (req, res) {
  res.locals.searchValue = req.session.data['badge-search'];
  res.render('admin/search-results', {'title':'Find a badge','search_class':'active'})
})

router.get('/admin/view-badge', function (req, res) {
  res.render('admin/view-badge', {'title':'View badge','search_class':'active'})
})

router.get('/admin/view-badge-external', function (req, res) {
  res.render('admin/view-badge-external', {'title':'View badge','search_class':'active'})
})

router.get('/admin/replace-badge', function (req, res) {
  res.render('admin/replace-badge', {'title':'Order a replacement badge','search_class':'active'})
})

router.get('/admin/replacement-ordered', function (req, res) {
  res.render('admin/replacement-ordered', {'title':'Replacement ordered','search_class':'active'})
})

router.get('/admin/cancel-badge', function (req, res) {
  res.render('admin/cancel-badge', {'title':'Cancel badge','search_class':'active'})
})

router.get('/admin/badge-cancelled', function (req, res) {
  res.render('admin/badge-cancelled', {'search_class':'active'})
})

router.get('/admin/view-my-details', function (req, res) {
  res.render('admin/view-my-details', {'title':'View my details','view_class':'active'})
})

router.get('/admin/renewals', function (req, res) {
  res.render('admin/renewals', {'title':'Renewals','renewals_class':'active'})
})

router.get('/admin/replacements', function (req, res) {
  res.render('admin/replacements', {'title':'Replacements','replacements_class':'active'})
})

router.get('/admin/updates', function (req, res) {
  res.render('admin/updates', {'title':'Updates','updates_class':'active'})
})

router.get('/admin/cancellations', function (req, res) {
  res.render('admin/cancellations', {'title':'Cancellations','cancellations_class':'active'})
})

// Candidate routes

router.get('/candidate', function (req, res) {
  res.locals.hideServiceName = 'yes';
  res.render('candidate/index.html')
  req.session.destroy()
});

router.get('/candidate/check-eligibility/', function (req, res) {
  res.render('candidate/check-eligibility/index.html', {'title':'Who are you applying for?'})
});

router.get('/candidate/check-eligibility/existing-badge/', function (req, res) {
  req.session.data['show'] = undefined;
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
        res.redirect('/candidate/check-eligibility/existing-badge?show=errors&existing=yes');
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

// router.get('/candidate/check-eligibility/existing-badge/badge-not-found-backend', function (req, res) {
//   switch (req.session.data['badge-not-found-how-to-proceed']) {
//     case "reenter":
//       res.redirect('/candidate/check-eligibility/existing-badge');
//       break;
//     case "new":
//       req.session.data['renewal-or-new-application'] = 'new';
//       res.redirect('/candidate/check-eligibility/find-your-council');
//       break;
//     case "renewal":
//       req.session.data['renewal-or-new-application'] = 'renewal';
//       res.redirect('/candidate/check-eligibility/find-your-council');
//       break;
//     default:
//       res.redirect('/candidate/check-eligibility/find-your-council');
//       break;
//   }
// });

router.get('/candidate/check-eligibility/existing-badge/review-backend', function (req, res) {
  switch (req.session.data['renewal-council-has-changed']) {
    case "yes":
      req.session.data['council-name'] = 'Manchester city council';
      res.redirect('/candidate/check-eligibility/enter-age');
      break;
    case "no":
      res.redirect('/candidate/check-eligibility/find-your-council');
      break;
    default:
      res.redirect('/candidate/check-eligibility/find-your-council');
      break;
  }
});

router.get('/candidate/check-eligibility/your-council-backend', function (req, res) {
  if (req.query.postcode) {
    req.session.data['council-name'] = 'Manchester city council';
    res.redirect('/candidate/check-eligibility/your-council');
  } else {
    res.redirect('/candidate/check-eligibility/enter-age');
  } 
});

router.get('/candidate/check-eligibility/benefits-backend', function (req, res) {
  if (req.query.benefit === 'none') {
    res.render('candidate/check-eligibility/disability');
  } else {
    res.redirect('/candidate/check-eligibility/decision');
  }
});

router.get('/candidate/check-eligibility/disability-backend', function (req, res) {
  if (req.session.data['disability'] === 'problems-walking') {
    res.redirect('/candidate/check-eligibility/walking');
  } else {
  	res.render('candidate/check-eligibility/decision');
  }
});

// router.get('/candidate/check-eligibility/walking-backend', function (req, res) {
//   res.render('candidate/check-eligibility/decision');
// });

router.get('/candidate/check-eligibility/existing-badge/not-for-review/', function (req, res) {
  res.locals.formAction = '/candidate/apply';
  res.render('candidate/check-eligibility/existing-badge/not-for-review.html');
});

router.get('/candidate/check-eligibility/enter-age', function (req, res) {
  if (req.session.data['applicant'] === 'organisation') {
    res.redirect('/candidate/check-eligibility/org-care-for');
  } else {
    res.render('candidate/check-eligibility/enter-age');
  }
});

router.get('/candidate/check-eligibility/org-transport', function (req, res) {
  if (req.session.data['org-care-for'] === 'no') {
    res.redirect('/candidate/check-eligibility/decision');
  } else {
    res.render('candidate/check-eligibility/org-transport');
  }
});

router.get('/candidate/check-eligibility/existing-badge/not-for-review-with-eligibility-questions', function (req, res) {
  res.locals.formAction = '/candidate/check-eligibility/find-your-council';
  res.render('candidate/check-eligibility/existing-badge/not-for-review');
});


// Apply

function sendBackToCheckAnswers(query, nextAction) {
  console.log("called");
  var locals;
  if (query.change === 'true') {
    console.log('true');
    locals = {
      'formAction': '/candidate/apply/check-answers',
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
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/dob'))
  res.render('candidate/apply/name')
})

router.get('/candidate/apply/name', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/dob'))
  res.render('candidate/apply/name')
})

router.get('/candidate/apply/dob', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/nino'))
  res.render('candidate/apply/dob')
})

router.get('/candidate/apply/nino', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/your-address'))
  res.render('candidate/apply/nino')
})

// router.get('/candidate/apply/gender', function (req, res) {
//   Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/select-address'))
//   res.render('candidate/apply/gender')
// })

router.get('/candidate/apply/your-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/candidate/apply/select-address'))
  res.render('candidate/apply/your-address')
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
      res.redirect('/candidate/prove-eligibility/walking-time');
    } else if (req.session.data['benefit'] === 'dla' || req.session.data['benefit'] === 'pip') {
      res.redirect('/candidate/eligibility-proof/provide-proof-of-your-eligibility');
    } else {
      res.redirect('/candidate/prove-eligibility');
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


  /* ------------------------------------------------------------------
     Prove eligibility
  ------------------------------------------------------------------ */

router.get('/candidate/prove-eligibility', function(req, res) {
  res.locals.formAction = 'prove-eligibility/list-treatments';
  res.render('candidate/prove-eligibility/describe-conditions');
});


// Treatments

router.get('/candidate/prove-eligibility/list-treatments', function(req, res) {
  var treatments = req.session.data['treatments-array'];
  delete res.locals.tableRows;
  if (treatments) {
    var tableRows = [];
    treatments.forEach(function(treatment,index) {
      tableRows.push([
        {
          "text": treatment.description
        },
        {
          "text": treatment.date
        },
        {
          "html": "<a href='delete-treatment/"+index+"'>Remove this</a>",
          "format": "numeric"
        }
      ])
    });
  }

  res.locals.tableRows = tableRows;
  res.locals.formAction = 'list-medication';
  res.render('candidate/prove-eligibility/list-treatments');
});

router.get('/candidate/prove-eligibility/add-treatment', function(req, res) {
  res.locals.formAction = 'create-treatment';
  res.render('candidate/prove-eligibility/add-treatment');
});

router.get('/candidate/prove-eligibility/create-treatment', function(req, res) {
  var treatment = {
    "description": req.session.data['treatment-description'],
    "date": req.session.data['treatment-date']
  }

  if (req.session.data['treatments-array']) {
    req.session.data['treatments-array'].push(treatment);
  } else {
    req.session.data['treatments-array'] = [treatment];
  }

  delete req.session.data['treatment-description','treatment-date'];
  res.redirect('/candidate/prove-eligibility/list-treatments');
});

router.get('/candidate/prove-eligibility/delete-treatment/:id', function(req, res) {
  req.session.data['treatments-array'].splice(req.params.id, 1);
  res.redirect('/candidate/prove-eligibility/list-treatments');
});

// Medication

router.get('/candidate/prove-eligibility/list-medication', function(req, res) {
  var medication = req.session.data['medication-array'];
  delete res.locals.tableRows;
  if (medication) {
    var tableRows = [];
    medication.forEach(function(item,index) {
    tableRows.push([
        {
          "text": item.name
        },
        {
          "text": item.type
        },
        {
          "text": item.dosage
        },
        {
          "html": "<a href='delete-medication/"+index+"'>Remove this</a>",
          "format": "numeric"
        }
      ])
    });
  }

  res.locals.tableRows = tableRows;
  res.locals.formAction = 'list-healthcare-professionals';
  res.render('candidate/prove-eligibility/list-medication');
});

router.get('/candidate/prove-eligibility/add-medication', function(req, res) {
  res.locals.formAction = 'create-medication';
  res.render('candidate/prove-eligibility/add-medication');
});

router.get('/candidate/prove-eligibility/create-medication', function(req, res) {
  var medication = {
    "name": req.session.data['medication-name'],
    "type": req.session.data['medication-type'],
    "regularity": req.session.data['medication-regularity'],
    "dosage": req.session.data['medication-dosage']
  }

  if (req.session.data['medication-array']) {
    req.session.data['medication-array'].push(medication);
  } else {
    req.session.data['medication-array'] = [medication];
  }

  delete req.session.data['medication-name','medication-type','medication-regularity','medication-dosage'];
  res.redirect('/candidate/prove-eligibility/list-medication');
});

router.get('/candidate/prove-eligibility/delete-medication/:id', function(req, res) {
  req.session.data['medication-array'].splice(req.params.id, 1);
  res.redirect('/candidate/prove-eligibility/list-medication');
});


// Healthcare professionals

router.get('/candidate/prove-eligibility/list-healthcare-professionals', function(req, res) {
  var hcps = req.session.data['hcp-array'];
  delete res.locals.tableRows;
  if (hcps) {
    var tableRows = [];
    hcps.forEach(function(item,index) {
    tableRows.push([
        {
          "text": item.name
        },
        {
          "text": item.hospital
        },
        {
          "html": "<a href='delete-hcp/"+index+"'>Remove this</a>",
          "format": "numeric"
        }
      ])
    });
  }

  res.locals.tableRows = tableRows;
  res.render('candidate/prove-eligibility/list-healthcare-professionals');
});

router.get('/candidate/prove-eligibility/add-healthcare-professional', function(req, res) {
  res.locals.formAction = 'create-hcp';
  res.render('candidate/prove-eligibility/add-healthcare-professional');
});

router.get('/candidate/prove-eligibility/create-hcp', function(req, res) {
  var hcp = {
    "name": req.session.data['hcp-name'],
    "hospital": req.session.data['hcp-hospital']
  }

  if (req.session.data['hcp-array']) {
    req.session.data['hcp-array'].push(hcp);
  } else {
    req.session.data['hcp-array'] = [hcp];
  }

  delete req.session.data['hcp-name','hcp-hospital'];
  res.redirect('/candidate/prove-eligibility/list-healthcare-professionals');
});

router.get('/candidate/prove-eligibility/delete-hcp/:id', function(req, res) {
  req.session.data['hcp-array'].splice(req.params.id, 1);
  res.redirect('/candidate/prove-eligibility/list-healthcare-professionals');
});


router.get('/candidate/prove-eligibility/how-were-your-mobility-aids-provided', function(req, res) {
  res.render('candidate/prove-eligibility/how-were-your-mobility-aids-provided');
});


router.get('/candidate/prove-eligibility/use-a-mobility-aid', function(req, res) {
  res.render('candidate/prove-eligibility/use-a-mobility-aid');
});

router.get('/candidate/prove-eligibility/use-a-mobility-aid-backend', function(req, res) {
  if (req.session.data['use-a-mobility-aid'] === 'yes' && req.session.data['mobility-aids-used']) {
    res.redirect('/candidate/prove-eligibility/how-were-your-mobility-aids-provided');
  } else {
    res.redirect('/candidate/prove-eligibility/your-medical-condition');
  }
});

router.get('/candidate/prove-eligibility/how-were-your-mobility-aids-provided', function(req, res) {
  res.render('candidate/prove-eligibility/how-were-your-mobility-aids-provided');
});

router.get('/candidate/prove-eligibility/your-medical-condition', function(req, res) {
  res.render('candidate/prove-eligibility/your-medical-condition');
});

router.get('/candidate/prove-eligibility/surgeries-and-treatment', function(req, res) {
  res.render('candidate/prove-eligibility/surgeries-and-treatment');
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
