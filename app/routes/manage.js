const express = require('express')
const router = express.Router()

router.get('/', function (req, res) {
  res.redirect('manage-blue-badges/sign-in');
});

router.get('/sign-in', function (req, res) {
  res.locals.formAction = '/manage-blue-badges/all-applications';
  res.render('manage-blue-badges/sign-in', {'title':'Sign in'})
  req.session.destroy()
});

router.get('/reset-password', function (req, res) {
  res.locals.formAction = '/manage-blue-badges/reset-email-sent';
  req.session.data['show'] = undefined;
  res.render('manage-blue-badges/reset-password', {'title':'Reset your password'})
});

router.get('/reset-email-sent', function (req, res) {
  res.locals.formAction = '/manage-blue-badges/reset-password';
  res.render('manage-blue-badges/reset-email-sent', {'title':'Link sent'})
});

router.get('/error-404', function (req, res) {
  res.render('manage-blue-badges/error-404', {'title':'Page not found'})
});

router.get('/error-500', function (req, res) {
  res.render('manage-blue-badges/error-500', {'title':'Something went wrong'})
});

router.get('/link-expired', function (req, res) {
  res.locals.formAction = '/manage-blue-badges/reset-password';
  res.render('manage-blue-badges/link-expired', {'title':'Link expired'})
});

router.get('/set-your-password', function (req, res) {
  res.locals.formAction = '/manage-blue-badges/all-applications';
  res.render('manage-blue-badges/set-your-password', {'title':'Set your password'})
});

router.get('/all-applications', function (req, res) {
  res.render('manage-blue-badges/all-applications', {'title':'All applications','app_class':'active'})
});

router.get('/new-application', function (req, res) {
  res.render('manage-blue-badges/new-application', {'title':'New application','app_class':'active'})
})

router.get('/manage-users', function (req, res) {
  req.session.data['success'] = undefined;
  res.render('manage-blue-badges/manage-users', {'title':'Manage users','manage_class':'active'})
});

router.get('/users-results', function (req, res) {
  res.locals.searchValue = req.session.data['search-box'];
  res.render('manage-blue-badges/users-results', {'title':'Manage users','manage_class':'active'})
});

router.get('/create-user', function (req, res) {
  res.render('manage-blue-badges/create-user', {'title':'Create a new user','manage_class':'active'})
});

router.get('/edit-details', function (req, res) {
  res.render('manage-blue-badges/edit-details', {'title':'User details','manage_class':'active'})
});

router.get('/remove-user', function (req, res) {
  res.render('manage-blue-badges/remove-user', {'title':'Remove user','manage_class':'active'})
});

router.get('/order-a-badge', function (req, res) {
  req.session.data = undefined;
  res.render('manage-blue-badges/order-a-badge/index', {'title':'Order a badge','order_class':'active', 'formAction':'/manage-blue-badges/order-a-badge/details'})
});

router.get('/order-a-badge/details', function (req, res) {
  if (req.session.data['badge-type'] === 'person') {
    res.locals.title = 'Personal details';
  } else {
    res.locals.title = 'Organisation details';
  }

  res.render('manage-blue-badges/order-a-badge/details', {'order_class':'active', 'formAction':'/manage-blue-badges/order-a-badge/processing'});
});

router.get('/order-a-badge/change-details', function (req, res) {
  if (req.session.data['badge-type'] === 'person') {
    res.locals.title = 'Personal details';
  } else {
    res.locals.title = 'Organisation details';
  }
  res.render('manage-blue-badges/order-a-badge/details', {'title':'Order a badge','order_class':'active', 'formAction':'/manage-blue-badges/order-a-badge/check'})
});

router.get('/order-a-badge/processing', function (req, res) {
  var todayDate = new Date();
  var startDay = todayDate.getDate();
  var startMonth = todayDate.getMonth()+1; //January is 0!
  var startYear = todayDate.getFullYear();
  var expiryDatePlus3Years = new Date(new Date().setFullYear(new Date().getFullYear() + 3));
  var expiryDate = new Date(expiryDatePlus3Years.setDate(expiryDatePlus3Years.getDate() - 1));
  var expiryDay = expiryDate.getDate();
  var expiryMonth = expiryDate.getMonth()+1; // January is 0!
  var expiryYear = expiryDate.getFullYear();

  res.render('manage-blue-badges/order-a-badge/processing', {'title':'Processing','order_class':'active',
    'startDay': startDay, 'startMonth': startMonth, 'startYear': startYear,
    'expiryDay': expiryDay, 'expiryMonth': expiryMonth, 'expiryYear': expiryYear
  });
});

router.get('/order-a-badge/check', function (req, res) {
  res.render('manage-blue-badges/order-a-badge/check', {'title':'Check order','order_class':'active'})
})

router.get('/order-a-badge/badge-ordered', function (req, res) {
  req.session.destroy();
  res.render('manage-blue-badges/badge-ordered', {'order_class':'active'})
})

router.get('/search-for-a-badge', function (req, res) {
  res.render('manage-blue-badges/search-for-a-badge', {'title':'Find a badge','search_class':'active'})
})

router.get('/search-results', function (req, res) {
  res.locals.searchValue = req.session.data['badge-search'];
  res.render('manage-blue-badges/search-results', {'title':'Find a badge','search_class':'active'})
})

router.get('/view-badge', function (req, res) {
  res.render('manage-blue-badges/view-badge', {'title':'View badge','search_class':'active'})
})

router.get('/view-badge-external', function (req, res) {
  res.render('manage-blue-badges/view-badge-external', {'title':'View badge','search_class':'active'})
})

router.get('/replace-badge', function (req, res) {
  res.render('manage-blue-badges/replace-badge', {'title':'Order a replacement badge','search_class':'active'})
})

router.get('/replacement-ordered', function (req, res) {
  res.render('manage-blue-badges/replacement-ordered', {'title':'Replacement ordered','search_class':'active'})
})

router.get('/cancel-badge', function (req, res) {
  res.render('manage-blue-badges/cancel-badge', {'title':'Cancel badge','search_class':'active'})
})

router.get('/badge-cancelled', function (req, res) {
  res.render('manage-blue-badges/badge-cancelled', {'search_class':'active'})
})

router.get('/view-my-details', function (req, res) {
  res.render('manage-blue-badges/view-my-details', {'title':'View my details','view_class':'active'})
})

router.get('/renewals', function (req, res) {
  res.render('manage-blue-badges/renewals', {'title':'Renewals','renewals_class':'active'})
})

router.get('/replacements', function (req, res) {
  res.render('manage-blue-badges/replacements', {'title':'Replacements','replacements_class':'active'})
})

router.get('/updates', function (req, res) {
  res.render('manage-blue-badges/updates', {'title':'Updates','updates_class':'active'})
})

router.get('/cancellations', function (req, res) {
  res.render('manage-blue-badges/cancellations', {'title':'Cancellations','cancellations_class':'active'})
})

module.exports = router
