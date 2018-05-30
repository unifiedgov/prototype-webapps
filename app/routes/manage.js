const express = require('express')
const router = express.Router()

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

module.exports = router
