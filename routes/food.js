var express = require('express');
var router = express.Router();
var fs  = require('fs');

/* GET food page. */
router.get('/', function(req, res, next) {

    res.render('food', { title: 'something' });
});

module.exports = router;
