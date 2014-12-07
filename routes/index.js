var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Tempy',
    temp: req.temps,
    current: req.current
  });
});

router.get('/style', function(req, res) {
  res.render('style', {
    title: 'Style Test'
  })
})

module.exports = router;
