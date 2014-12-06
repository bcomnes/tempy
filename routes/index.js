var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    title: 'Tempy'
  });
});

router.get('/temp', function(req, res) {
  res.render('temp', {
    title: 'Tempy',
    temp: req.temps
  })
})

module.exports = router;
