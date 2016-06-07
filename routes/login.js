var express = require('express');
var router = express.Router();
var fs  = require('fs');


/* GET login page. */
router.get('/', function(req, res, next) {

    //console.log(user.something);

    res.render('login', { title: 'something' });
});

module.exports = router;
