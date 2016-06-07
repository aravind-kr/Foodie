var express = require('express');
var router = express.Router();
var fs  = require('fs');

/* GET result page. */
router.get('/', function(req, res, next) {

    res.render('result', { title: 'something' });
});

module.exports = router;
