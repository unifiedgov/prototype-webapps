const express = require('express')
const router = express.Router()

// Set the right pronouns
router.use(function(req, res, next) {
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

/* 
  ---------------------------------------------------------------
  Check before you start
  --------------------------------------------------------------- 
*/

// Check eligibility

const checkEligibilityTemplatePath = 'apply-for-a-blue-badge/check-eligibility/';

router.get('/', function (req, res) {
  res.locals.hideServiceName = 'yes';
  res.render('apply-for-a-blue-badge/index.html');
  req.session.destroy();
});

router.get('/check-eligibility/', function (req, res) {
  res.render(checkEligibilityTemplatePath+'index.html', {'title':'Who are you applying for?'})
});

router.get('/check-eligibility/existing-badge/', function (req, res) {
  req.session.data['show'] = undefined;
  res.locals.formAction = '/apply-for-a-blue-badge/check-eligibility/existing-badge/index-backend';
  res.render(checkEligibilityTemplatePath+'existing-badge/index.html')
});

router.get('/check-eligibility/existing-badge/index-backend', function (req, res) {
  switch (req.session.data['renewal-or-new-application']) {
    case "renewal":
      var blueBadgeNumber = req.session.data['existing-blue-badge-number'];
      if (blueBadgeNumber.indexOf('1111') === 0 && blueBadgeNumber.lastIndexOf('1111') === blueBadgeNumber.length-4) {
        res.redirect('/apply-for-a-blue-badge/check-eligibility/existing-badge/not-for-renewal');
      } else if (blueBadgeNumber.indexOf('2222') === 0 && blueBadgeNumber.lastIndexOf('2222') === blueBadgeNumber.length-4) {
        res.redirect('/apply-for-a-blue-badge/check-eligibility/existing-badge/not-for-review');
      } else if (blueBadgeNumber.indexOf('3333') === 0 && blueBadgeNumber.lastIndexOf('3333') === blueBadgeNumber.length-4) {
        res.redirect('/apply-for-a-blue-badge/check-eligibility/existing-badge?show=errors&existing=yes');
      } else {
        res.redirect('/apply-for-a-blue-badge/check-eligibility/existing-badge/not-for-review-with-eligibility-questions');
      }
      break;
    case "new":
      res.redirect('/apply-for-a-blue-badge/check-eligibility/find-your-council');
      break;
    default:
      res.redirect('/apply-for-a-blue-badge/check-eligibility/find-your-council');
      break;
  }
});

router.get('/check-eligibility/existing-badge/review-backend', function (req, res) {
  switch (req.session.data['renewal-council-has-changed']) {
    case "yes":
      req.session.data['council-name'] = 'Manchester city council';
      res.redirect('/apply-for-a-blue-badge/check-eligibility/enter-age');
      break;
    case "no":
      res.redirect('/apply-for-a-blue-badge/check-eligibility/find-your-council');
      break;
    default:
      res.redirect('/apply-for-a-blue-badge/check-eligibility/find-your-council');
      break;
  }
});

router.get('/check-eligibility/your-council-backend', function (req, res) {
  if (req.query.postcode) {
    req.session.data['council-name'] = 'Manchester city council';
    res.redirect('/apply-for-a-blue-badge/check-eligibility/your-council');
  } else {
    res.redirect('/apply-for-a-blue-badge/check-eligibility/enter-age');
  } 
});

router.get('/check-eligibility/benefits-backend', function (req, res) {
  if (req.query.benefit === 'none') {
    res.render('apply-for-a-blue-badge/check-eligibility/disability');
  } else {
    res.redirect('/apply-for-a-blue-badge/check-eligibility/decision');
  }
});

router.get('/check-eligibility/disability-backend', function (req, res) {
  if (req.session.data['disability'] === 'problems-walking') {
    res.redirect('/apply-for-a-blue-badge/check-eligibility/walking');
  } else {
  	res.render(checkEligibilityTemplatePath+'decision');
  }
});

// router.get('/check-eligibility/walking-backend', function (req, res) {
//   res.render('apply-for-a-blue-badge/check-eligibility/decision');
// });

router.get('/check-eligibility/existing-badge/not-for-review/', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prepare';
  res.render(checkEligibilityTemplatePath+'existing-badge/not-for-review.html');
});

router.get('/check-eligibility/enter-age', function (req, res) {
  if (req.session.data['applicant'] === 'organisation') {
    res.redirect('/apply-for-a-blue-badge/check-eligibility/org-care-for');
  } else {
    res.render(checkEligibilityTemplatePath+'enter-age');
  }
});

router.get('/check-eligibility/org-transport', function (req, res) {
  if (req.session.data['org-care-for'] === 'no') {
    res.redirect('/apply-for-a-blue-badge/check-eligibility/decision');
  } else {
    res.render(checkEligibilityTemplatePath+'org-transport');
  }
});

router.get('/check-eligibility/existing-badge/not-for-review-with-eligibility-questions', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/check-eligibility/find-your-council';
  res.render(checkEligibilityTemplatePath+'existing-badge/not-for-review');
});


/* 
  ---------------------------------------------------------------
  Prepare application
  --------------------------------------------------------------- 
*/

function sendBackToCheckAnswers(query, nextAction) {
  console.log("called");
  var locals;
  if (query.change === 'true') {
    console.log('true');
    locals = {
      'formAction': '/apply-for-a-blue-badge/check-answers',
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

// Personal details

const personDetailsPath = '/apply-for-a-blue-badge/personal-details/';
const personDetailsTemplatePath = 'apply-for-a-blue-badge/prepare/personal-details/';

router.get('/personal-details', function (req, res) {
  res.redirect(personDetailsPath+'name');
})

router.get('/personal-details/name', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,personDetailsPath+'dob'))
  res.render(personDetailsTemplatePath+'name')
})

router.get('/personal-details/dob', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,personDetailsPath+'nino'))
  res.render(personDetailsTemplatePath+'dob')
})

router.get('/personal-details/nino', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,personDetailsPath+'your-address'))
  res.render(personDetailsTemplatePath+'nino')
})

router.get('/personal-details/your-address', function (req, res) {
  if (req.query.change === 'true') {
    res.locals.formAction = 'select-address?change=true';
  } else {
    res.locals.formAction = 'select-address';
  }
  res.render(personDetailsTemplatePath+'your-address');
})

router.get('/personal-details/select-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,personDetailsPath+'contact-details'))
  res.render(personDetailsTemplatePath+'select-your-address')
})

router.get('/personal-details/enter-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,personDetailsPath+'contact-details'))
  res.render(personDetailsTemplatePath+'enter-your-address')
})

// Organisation details

const organisationDetailsPath = '/apply-for-a-blue-badge/organisation-details/';
const organisationDetailsTemplatePath = 'apply-for-a-blue-badge/prepare/organisation-details/';

router.get('/organisation-details/', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,organisationDetailsPath+'charity'))
  res.redirect(organisationDetailsPath+'name')
})

router.get('/organisation-details/name', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,organisationDetailsPath+'charity'))
  res.render(organisationDetailsTemplatePath+'name')
})

router.get('/organisation-details/charity', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,organisationDetailsPath+'find-address'))
  res.render(organisationDetailsTemplatePath+'charity')
})

router.get('/organisation-details/find-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,organisationDetailsPath+'select-address'))
  res.render(personDetailsTemplatePath+'your-address')
})

router.get('/organisation-details/select-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,organisationDetailsPath+'contact-details'))
  res.render(personDetailsTemplatePath+'select-your-address')
})

router.get('/organisation-details/enter-address', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,organisationDetailsPath+'contact-details'))
  res.render(personDetailsTemplatePath+'enter-your-address')
})

router.get('/organisation-details/contact-details', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,organisationDetailsPath+'list-vehicles'))
  res.render(personDetailsTemplatePath+'contact-details')
})

router.get('/organisation-details/list-vehicles', function(req, res) {
  var vehicles = req.session.data['vehicle-array'];
  delete res.locals.tableRows;
  if (vehicles) {
    var tableRows = [];
    vehicles.forEach(function(item,index) {
    tableRows.push([
        {
          "text": item.vrn
        },
        {
          "text": item.type
        },
        {
          "text": item.frequency
        },
        {
          "html": "<a href='delete-vehicle/"+index+"'>Remove this</a>",
          "format": "numeric"
        }
      ])
    });
  }

  res.locals.tableRows = tableRows;
  res.locals.formAction = '/apply-for-a-blue-badge/check-answers';
  res.render(organisationDetailsTemplatePath+'list-vehicles');
});

router.get('/organisation-details/add-vehicle', function(req, res) {
  res.locals.formAction = 'create-vehicle';
  res.render(organisationDetailsTemplatePath+'add-vehicle');
});

router.get('/organisation-details/create-vehicle', function(req, res) {
  var vehicle = {
    "vrn": req.session.data['vehicle-vrn'],
    "type": req.session.data['vehicle-type'],
    "frequency": req.session.data['vehicle-frequency'],
  }

  if (req.session.data['vehicle-array']) {
    req.session.data['vehicle-array'].push(vehicle);
  } else {
    req.session.data['vehicle-array'] = [vehicle];
  }

  delete req.session.data['vehicle-name','vehicle-type','vehicle-frequency'];
  res.redirect('/apply-for-a-blue-badge/organisation-details/list-vehicles');
});

router.get('/organisation-details/delete-vehicle/:id', function(req, res) {
  req.session.data['vehicle-array'].splice(req.params.id, 1);
  res.redirect('/apply-for-a-blue-badge/organisation-details/list-vehicles');
});

// Prove identity

router.get('/prove-your-identity', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render('apply-for-a-blue-badge/prepare/prove-your-identity')
})

// Prove eligibility

const proveEligibilityPath = '/apply-for-a-blue-badge/prove-eligibility/';
const proveEligibilityTemplatePath = 'apply-for-a-blue-badge/prepare/prove-eligibility/';

router.get('/prove-eligibility', function(req, res) {
  if (req.session.data['benefit'] !== 'none') {
  	res.redirect('/apply-for-a-blue-badge/prove-benefit');
  } else if (req.session.data['disability'] === 'problems-walking') {
    res.redirect(proveEligibilityPath+'walking-time');
  } else {
    res.redirect(proveEligibilityPath+'describe-conditions');
  }
});

router.get('/prove-benefit', function(req, res) {
  res.locals.formAction = proveEligibilityPath+'upload-benefit';
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
  res.render(proveEligibilityTemplatePath+'prove-benefit');
});

router.get('/prove-eligibility/upload-benefit', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-your-address';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render(proveEligibilityTemplatePath+'upload-benefit')
});


// Walking ability

router.get('/prove-eligibility/walking-time', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/what-makes-walking-difficult';
  res.render(proveEligibilityTemplatePath+'walking-time');
});

router.get('/prove-eligibility/what-makes-walking-difficult', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/how-quickly-do-you-walk';
  res.render(proveEligibilityTemplatePath+'what-makes-walking-difficult');
});

router.get('/prove-eligibility/how-quickly-do-you-walk', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/use-a-mobility-aid';
  res.render(proveEligibilityTemplatePath+'how-quickly-do-you-walk');
});

router.get('/prove-eligibility/use-a-mobility-aid', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/use-a-mobility-aid-backend';
  res.render(proveEligibilityTemplatePath+'use-a-mobility-aid');
});

router.get('/prove-eligibility/use-a-mobility-aid-backend', function(req, res) {
  if (req.session.data['use-a-mobility-aid'] === 'yes' && req.session.data['mobility-aids-used']) {
    res.redirect(proveEligibilityPath+'how-were-your-mobility-aids-provided');
  } else {
    res.redirect(proveEligibilityPath+'describe-conditions');
  }
});

router.get('/prove-eligibility/how-were-your-mobility-aids-provided', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/describe-conditions';
  res.render(proveEligibilityTemplatePath+'how-were-your-mobility-aids-provided');
});


// Describe condition

router.get('/prove-eligibility/describe-conditions', function(req, res) {
  res.locals.formAction = 'list-treatments';
  res.render(proveEligibilityTemplatePath+'describe-conditions');
});


// List treatments

router.get('/prove-eligibility/list-treatments', function(req, res) {
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
  res.render(proveEligibilityTemplatePath+'list-treatments');
});

router.get('/prove-eligibility/add-treatment', function(req, res) {
  res.locals.formAction = 'create-treatment';
  res.render(proveEligibilityTemplatePath+'add-treatment');
});

router.get('/prove-eligibility/create-treatment', function(req, res) {
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
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-treatments');
});

router.get('/prove-eligibility/delete-treatment/:id', function(req, res) {
  req.session.data['treatments-array'].splice(req.params.id, 1);
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-treatments');
});

// List medication

router.get('/prove-eligibility/list-medication', function(req, res) {
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
  res.render(proveEligibilityTemplatePath+'list-medication');
});

router.get('/prove-eligibility/add-medication', function(req, res) {
  res.locals.formAction = 'create-medication';
  res.render(proveEligibilityTemplatePath+'add-medication');
});

router.get('/prove-eligibility/create-medication', function(req, res) {
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
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-medication');
});

router.get('/prove-eligibility/delete-medication/:id', function(req, res) {
  req.session.data['medication-array'].splice(req.params.id, 1);
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-medication');
});


// List healthcare professionals

router.get('/prove-eligibility/list-healthcare-professionals', function(req, res) {
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
  res.locals.formAction = '/apply-for-a-blue-badge/prove-your-address'
  res.render(proveEligibilityTemplatePath+'list-healthcare-professionals');
});

router.get('/prove-eligibility/add-healthcare-professional', function(req, res) {
  res.locals.formAction = 'create-hcp';
  res.render(proveEligibilityTemplatePath+'add-healthcare-professional');
});

router.get('/prove-eligibility/create-hcp', function(req, res) {
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
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-healthcare-professionals');
});

router.get('/prove-eligibility/delete-hcp/:id', function(req, res) {
  req.session.data['hcp-array'].splice(req.params.id, 1);
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-healthcare-professionals');
});

// Prove address

router.get('/prove-your-address', function (req, res) {
  if ((req.query.change !== 'true') &&
     (req.session.data['identity-upload-shows-current-address'] === 'yes' ||
      req.session.data['benefit-proof-upload-shows-current-address'] === 'yes' ||
      req.session.data['identity-verified'] === 'yes')) {
    res.redirect('/apply-for-a-blue-badge/provide-photo');
  } else {
    res.locals.submitLabel = 'Continue';
    res.locals.change = req.query.change;
    res.locals.formAction = '/apply-for-a-blue-badge/provide-photo';
    res.render('apply-for-a-blue-badge/prepare/prove-your-address');
  }
})

router.get('/prove-your-address-backend', function (req, res) {
  if (req.query.change === 'true') {
    res.redirect('/apply-for-a-blue-badge/check-answers');
  } else {
    res.redirect('/apply-for-a-blue-badge/provide-photo');
  }
})

// Add photo

router.get('/provide-photo', function (req, res) {
  // Form action specified in view
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render('apply-for-a-blue-badge/prepare/provide-photo');
})

router.get('/provide-photo/upload-your-photo', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/check-answers';
  res.render('apply-for-a-blue-badge/prepare/upload-your-photo');
});

router.get('/check-answers', function (req, res) {
  res.render('apply-for-a-blue-badge/prepare/check-answers'); //, {'formAction':'/apply-for-a-blue-badge/prepare/paying-for-your-blue-badge'})
})

/* 
  ---------------------------------------------------------------
  Apply
  --------------------------------------------------------------- 
*/

router.get('/declaration', function (req, res) {
  res.render('apply-for-a-blue-badge/apply/declaration', {'formAction':'/apply-for-a-blue-badge/apply/complete'})
})


router.get('/paying-for-your-blue-badge', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/paying-for-your-blue-badge-backend';
  res.render('apply-for-a-blue-badge/apply/paying-for-your-blue-badge');
});

router.get('/paying-for-your-blue-badge-backend', function(req, res) {
  if (req.query['pay-when'] === 'later') {
    res.redirect('/apply-for-a-blue-badge/apply/confirmation');
  } else {
    req.session.data['pay-when'] = 'now';
    res.redirect('https://production-1-production-pay-products-ui.cloudapps.digital/pay/a9e0f2ce1f7148ef879bdc1fa04ba652');
  };
});


router.get('/confirmation', function (req, res) {
  res.render('apply-for-a-blue-badge/apply/confirmation')
})

router.get('/version-history', function(req, res) {
  res.render('version-history');
});

module.exports = router
