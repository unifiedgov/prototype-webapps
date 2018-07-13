const express = require('express')
const router = express.Router()

// Set the right pronouns
router.use(function(req, res, next) {
  var applicant = req.session.data['applicant'];
  res.locals.my = applicant === 'someone-else' ? 'their' : 'my';
  res.locals.you = applicant === 'someone-else' ? 'they' : 'you';
  res.locals.your = applicant === 'someone-else' ? 'their' : 'your';
  res.locals.youOrThem = applicant === 'someone-else' ? 'them' : 'you';

  if (!req.session.data['council-name']) {
    res.locals.data['council-name'] = 'your local council';
  } 

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

router.get('/apply-for-a-blue-badge/progress-saved', function (req, res) {
  res.render('apply-for-a-blue-badge/progress-saved');
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
    if(req.query.postcode.indexOf("BT1") >= 0) {
      res.redirect('/apply-for-a-blue-badge/check-eligibility/nir-explain');
    } else {
      res.redirect('/apply-for-a-blue-badge/check-eligibility/your-council');
    }
  } else {
    if(req.session.data['council-name'] == 'Northern Ireland') {
      res.redirect('/apply-for-a-blue-badge/check-eligibility/nir-explain');
    } else {
      res.redirect('/apply-for-a-blue-badge/check-eligibility/enter-age');
    }
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
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,personDetailsPath+'gender'))
  res.render(personDetailsTemplatePath+'name')
})

router.get('/personal-details/gender', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,personDetailsPath+'dob'))
  res.render(personDetailsTemplatePath+'gender')
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
  res.locals.submitLabel = 'Continue';
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

router.get('/personal-details/contact-details', function (req, res) {
  Object.assign(res.locals,sendBackToCheckAnswers(req.query,'/apply-for-a-blue-badge/prove-eligibility'))
  res.render(personDetailsTemplatePath+'contact-details')
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
    "frequency": req.session.data['vehicle-frequency'],
  }

  if (req.session.data['vehicle-array']) {
    req.session.data['vehicle-array'].push(vehicle);
  } else {
    req.session.data['vehicle-array'] = [vehicle];
  }

  delete req.session.data['vehicle-name','vehicle-frequency'];
  res.redirect('/apply-for-a-blue-badge/organisation-details/list-vehicles');
});

router.get('/organisation-details/delete-vehicle/:id', function(req, res) {
  req.session.data['vehicle-array'].splice(req.params.id, 1);
  res.redirect('/apply-for-a-blue-badge/organisation-details/list-vehicles');
});

// Prove identity

router.get('/prove-your-identity', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-your-address';
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
  } else if (req.session.data['disability'] === 'blind') {
    res.redirect(proveEligibilityPath+'are-you-registered-blind');
  } else if (req.session.data['disability'] === 'problems-walking') {
    res.redirect(proveEligibilityPath+'what-makes-walking-difficult');
  } else if (req.session.data['disability'] === 'child-bulky-equipment') {
    res.redirect(proveEligibilityPath+'medical-equipment');
  } else if (req.session.data['disability'] === 'arms') {
    res.redirect(proveEligibilityPath+'how-often-drive');
  } else {
    res.redirect(proveEligibilityPath+'describe-conditions');
  }
});

router.get('/prove-benefit', function(req, res) {
  if (req.session.data['benefit'] === 'armed-forces' || req.session.data['benefit'] === 'war-pensioners') {
    res.redirect(proveEligibilityPath+'upload-benefit');
  } else {
    res.locals.formAction = proveEligibilityPath+'upload-benefit';
    res.locals.submitLabel = 'Continue';
    res.locals.change = req.query.change;
    req.session.data['benefit-proof-file-upload'] = undefined;
    req.session.data['benefit-proof-file'] = undefined;
    res.render(proveEligibilityTemplatePath+'prove-benefit');
  }
});

router.get('/prove-eligibility/upload-benefit', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-your-address';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render(proveEligibilityTemplatePath+'upload-benefit')
});

// Registered blind (severely sight impaired)

router.get('/prove-eligibility/are-you-registered-blind', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/registered-blind-backend';
  res.render(proveEligibilityTemplatePath+'are-you-registered-blind');
});

router.get('/prove-eligibility/registered-blind-backend', function(req, res) {
  if (req.session.data['registered-blind'] === 'yes') {
    res.redirect(proveEligibilityPath+'blind-consent-la');
  } else {
    res.redirect(proveEligibilityPath+'upload-blind-cvi');
  }
});

router.get('/prove-eligibility/blind-consent-la', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/blind-consent-backend';
  res.render(proveEligibilityTemplatePath+'blind-consent-la');
});

router.get('/prove-eligibility/blind-consent-backend', function(req, res) {
  if (req.session.data['blind-consent'] === 'yes') {
    res.redirect(proveEligibilityPath+'blind-select-council');
  } else {
    res.redirect(proveEligibilityPath+'upload-blind-cvi');
  }
});

router.get('/prove-eligibility/blind-select-council', function(req, res) {
  res.locals.formAction = proveEligibilityPath+'describe-conditions';
  res.render(proveEligibilityTemplatePath+'blind-select-council');
});

router.get('/prove-eligibility/upload-blind-cvi', function (req, res) {
  res.locals.formAction = 'describe-conditions';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render(proveEligibilityTemplatePath+'upload-blind-cvi')
});

// Walking ability

router.get('/prove-eligibility/what-makes-walking-difficult', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/list-mobility-aids';
  res.render(proveEligibilityTemplatePath+'what-makes-walking-difficult');
});

router.get('/prove-eligibility/list-mobility-aids', function(req, res) {
  var mobilityAids = req.session.data['mobility-aids-array'];
  delete res.locals.tableRows;
  if (mobilityAids) {
    var tableRows = [];
    mobilityAids.forEach(function(aid,index) {
      tableRows.push([{"text": aid.name},{"text": aid.usage},{"html": "<a href='delete-mobility-aid/"+index+"'>Remove this</a>","format": "numeric"}])
    });
  }

  res.locals.tableRows = tableRows;
  res.locals.formAction = 'walking-time';
  res.render(proveEligibilityTemplatePath+'list-mobility-aids');
});

router.get('/prove-eligibility/add-mobility-aid', function(req, res) {
  res.locals.formAction = 'create-mobility-aid';
  res.render(proveEligibilityTemplatePath+'add-mobility-aid');
});

router.get('/prove-eligibility/create-mobility-aid', function(req, res) {
  var mobilityAid = {
    "name": req.session.data['mobility-aid-name'],
    "usage": req.session.data['mobility-aid-usage'],
    "source": req.session.data['mobility-aid-source']
  }

  if (req.session.data['mobility-aids-array']) {
    req.session.data['mobility-aids-array'].push(mobilityAid);
  } else {
    req.session.data['mobility-aids-array'] = [mobilityAid];
  }

  delete req.session.data['mobility-aid-name','mobility-aid-usage','mobility-aid-source'];
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-mobility-aids');
});

router.get('/prove-eligibility/delete-mobility-aid/:id', function(req, res) {
  req.session.data['mobility-aids-array'].splice(req.params.id, 1);
  res.redirect('/apply-for-a-blue-badge/prove-eligibility/list-mobility-aids');
});


router.get('/prove-eligibility/walking-time', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/walking-time-backend';
  res.render(proveEligibilityTemplatePath+'walking-time');
});

router.get('/prove-eligibility/walking-time-backend', function(req, res) {
  if (req.session.data['how-long-walk'] === 'cant-walk') {
    res.redirect('/apply-for-a-blue-badge/describe-conditions');
  } else {
    res.redirect(proveEligibilityPath+'how-quickly-do-you-walk');
  }
});

router.get('/prove-eligibility/how-quickly-do-you-walk', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/describe-conditions';
  res.render(proveEligibilityTemplatePath+'how-quickly-do-you-walk');
});


// router.get('/prove-eligibility/use-a-mobility-aid', function(req, res) {
//   res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/use-a-mobility-aid-backend';
//   res.render(proveEligibilityTemplatePath+'use-a-mobility-aid');
// });

// router.get('/prove-eligibility/use-a-mobility-aid-backend', function(req, res) {
//   if (req.session.data['mobility-aids-used'] == 'dont-use') {
//     res.redirect(proveEligibilityPath+'describe-conditions');
//   } else {
//     res.redirect(proveEligibilityPath+'how-were-your-mobility-aids-provided');
//   }
// });

// router.get('/prove-eligibility/how-were-your-mobility-aids-provided', function(req, res) {
//   res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/describe-conditions';
//   res.render(proveEligibilityTemplatePath+'how-were-your-mobility-aids-provided');
// });

// Both arms

router.get('/prove-eligibility/how-often-drive', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/drive-adapted-vehicle';
  res.render(proveEligibilityTemplatePath+'how-often-drive');
});

router.get('/prove-eligibility/drive-adapted-vehicle', function(req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/prove-eligibility/drive-adapted-backend';
  res.render(proveEligibilityTemplatePath+'drive-adapted-vehicle');
});

router.get('/prove-eligibility/drive-adapted-backend', function(req, res) {
  if (req.session.data['drive-adapted-vehicle'] == 'yes') {
    res.redirect(proveEligibilityPath+'upload-adapted-evidence');
  } else {
    res.redirect(proveEligibilityPath+'describe-conditions');
  }
});

router.get('/prove-eligibility/upload-adapted-evidence', function (req, res) {
  res.locals.formAction = 'describe-conditions';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render(proveEligibilityTemplatePath+'upload-adapted-evidence')
});

// Under 3

router.get('/prove-eligibility/medical-equipment', function(req, res) {
  res.locals.formAction = 'describe-conditions';
  res.render(proveEligibilityTemplatePath+'medical-equipment');
});


// Describe condition

router.get('/prove-eligibility/describe-conditions', function(req, res) {
  if (req.session.data['disability'] == 'problems-walking') {
    res.locals.formAction = 'list-treatments';
  } else if (req.session.data['disability'] == 'child-bulky-equipment' || req.session.data['disability'] == 'child-close-to-vehicle'){
    res.locals.formAction = 'list-healthcare-professionals';
  } else {
    res.locals.formAction = '/apply-for-a-blue-badge/prove-your-identity';
  }
  
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
  res.locals.formAction = '/apply-for-a-blue-badge/prove-your-identity'
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
  res.locals.formAction = '/apply-for-a-blue-badge/provide-photo-backend';
  res.locals.submitLabel = 'Continue';
  res.locals.change = req.query.change;
  res.render('apply-for-a-blue-badge/prepare/provide-photo');
})

router.get('/provide-photo-backend', function(req, res) {
  if (req.session.data['already-have-photo'] == 'yes') {
    res.redirect('/apply-for-a-blue-badge/check-answers');
  } else {
    res.redirect('/apply-for-a-blue-badge/take-your-photo');
  }
});

router.get('/device-take-photo', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/check-answers';
  res.locals.submitLabel = 'Continue';
  res.render('apply-for-a-blue-badge/prepare/device-take-photo');
});

router.get('/take-your-photo', function (req, res) {
  res.locals.formAction = '/apply-for-a-blue-badge/take-photo-backend';
  res.locals.submitLabel = 'Continue';
  res.render('apply-for-a-blue-badge/prepare/take-your-photo');
});

router.get('/take-photo-backend', function(req, res) {
  if (req.session.data['devices-camera'] == 'yes') {
    res.redirect('/apply-for-a-blue-badge/device-take-photo');
  } else {
    res.redirect('/apply-for-a-blue-badge/check-answers');
  }
});

router.get('/check-answers', function (req, res) {
  res.render('apply-for-a-blue-badge/prepare/check-answers'); //, {'formAction':'/apply-for-a-blue-badge/prepare/paying-for-your-blue-badge'})
})

/* 
  ---------------------------------------------------------------
  Guidance
  --------------------------------------------------------------- 
*/

router.get('/guidance', function (req, res) {
  res.render('apply-for-a-blue-badge/guidance/find-camera');
})

router.get('/get-document', function (req, res) {
  res.render('apply-for-a-blue-badge/guidance/get-document');
})


router.get('/before-take-photo', function (req, res) {
  res.render('apply-for-a-blue-badge/guidance/before-take-photo');
})

router.get('/taking-the-photo', function (req, res) {
  res.render('apply-for-a-blue-badge/guidance/taking-the-photo');
})

router.get('/transfer-the-image', function (req, res) {
  res.render('apply-for-a-blue-badge/guidance/transfer-the-image');
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
    res.redirect('https://products.payments.service.gov.uk/pay/6082e5de8f0542ed8ae20ef9b9feaeac');
  };
});

router.get('/confirmation', function (req, res) {
  res.render('apply-for-a-blue-badge/apply/confirmation')
})

router.get('/version-history', function(req, res) {
  res.render('version-history');
});

module.exports = router
