var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var jsondb = require('node-json-db');
var multer = require('multer');
var sessions = require('client-sessions');
//var authtoken = "3a42a4e6f67701fc7ae4b55ac299e521";
//var acsid = "ACbd3131b82fc3fd04a70cfec1fd854585";
//var twilio = require('/usr/lib/node_modules/twilio/lib')(acsid,authtoken);


var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var food = require('./routes/food');
var result = require('./routes/result');
var direction = require('./routes/direction');

var app = express();
app.locals.pathed = path.resolve('../Foodie','/views/images');

console.log(path.resolve('/Foodie','/views/images'));

app.locals.users = require('./restaurant.json');
app.locals.food_db = require('./food-items.json');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( express.static( "public" ) );


app.use('/', routes);
app.use('/users', users);
app.use('/login', login);
app.use('/food',food);
app.use('/result',result);
app.use('/direction',direction);

//registration function
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.post('/signup', function (req, res) {
    console.log(req.body);
    var db = new jsondb("user_login",true,false);
    var num = db.getData("/count") + 1;
    db.push("/user"+num+"/name",req.body.username);
    db.push("/user"+num+"/email",req.body.email);
    db.push("/user"+num+"/password",req.body.password);
    db.push("/user"+num+"/id",num);
    db.push("/count",num);
    res.redirect('/login');

    res.sendStatus(200);
    db.save();
    db.reload();
});


app.use(sessions({
    cookieName: 'mySession',
    secret: 'blargadeeblargblarg',
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5
}));

app.post('/login', function (req, res) {
    console.log(req.body);
    var db = new jsondb("user_login",true,false);
    //var data = JSON.stringify(db.data);
    /*data.forEach(function (item) {
        if(item.name != req.body.user){
            console.log("works");
        }
    });*/
    var count = db.getData('/count');

    for(var i =1 ; i<=count ; i++){
        var username = "user"+i;
        if (db.getData('/'+username+'/name') == req.body.user){
            console.log("username matched");
            if(db.getData('/'+username+'/password') == req.body.pass){
                req.mySession.user = req.body.user;
                console.log(req.mySession.user);
                res.redirect('/');
                break;
            }
        }else{
            console.log("unsucccessfull");
            res.redirect('/login');
        }
    }
    res.sendStatus(200);
});

app.post('/logout', function (req, res) {    
    req.mySession.reset();
    res.redirect('/login');
    console.log(req.mySession.user);
    res.sendStatus(200);
});


//var db = new jsondb("user_login",true,false);
//db.push("/test1","super test");

//save data to db
app.post('/location', function (req, res) {
   // console.log(req.body);
    var db = new jsondb("user_login",true,false);
    var username = req.mySession.user;
    var count = db.getData('/count');
    for(var i=1;i<=count;i++) {
        if(username== db.getData("/user"+i+"/name")) {
            db.push("/user" + i + "/location", req.body.city);
            break;
        }
    }
    res.redirect('/');
    res.sendStatus(200);
    db.save();
    db.reload();
});

app.post('/preferences', function (req, res) {
    //console.log(req.body);
    var db = new jsondb("user_login",true,false);
    var username = req.mySession.user;
    var food_number;
    var flag = true;
    var i,j;
    var count = db.getData('/count');
    for(i=1,j=1;i<=count && flag;i++) {
        //food_number = db.getData("/user"+i+"/nooffood");
        if(username== db.getData("/user"+i+"/name")) {
            db.push("/user" + i + "/food/item"+ j++, req.body.food_preference);
            flag = false;
        }
    }
    db.push("/user"+i-1+"/nooffood",food_number+1);
    res.redirect('/');
    res.sendStatus(200);
    db.save();
    db.reload();
});

app.post('/categories', function (req, res) {
    //console.log(req.body);
    var db = new jsondb("user_login",true,false);
    var username = req.mySession.user;
    var count = db.getData('/count');
    //console.log(req.body.bengali);
    //db.push();
    for(var i=1;i<=count;i++) {
        if(username== db.getData("/user"+i+"/name")) {
            db.push("/user" + i + "/categories/andhra", req.body.andhra);
            db.push("/user" + i + "/categories/bengali", req.body.bengali);
            db.push("/user" + i + "/categories/tamilnadu", req.body.tamilnadu);
            db.push("/user" + i + "/categories/rajasthani", req.body.rajesthani);
            db.push("/user" + i + "/categories/goa", req.body.goa);
            db.push("/user" + i + "/categories/kerala", req.body.kerala);
            db.push("/user" + i + "/categories/punjabi", req.body.punjabi);
            db.push("/user" + i + "/categories/pune", req.body.pune);
            db.push("/user" + i + "/categories/karnataka", req.body.karnataka);
            db.push("/user" + i + "/categories/gujarati", req.body.gujarati);
            db.push("/user" + i + "/categories/thepla", req.body.thepla);
            db.push("/user" + i + "/categories/himalayan", req.body.himalayan);
            break;
        }
    }

    res.redirect('/food');
    res.sendStatus(200);
    db.save();
    db.reload();
});

app.post('/andhra', function (req, res) {
    //console.log(req.body);
    var db = new jsondb("user_login",true,false);
    var username = req.mySession.user;
    var count = db.getData('/count');
    //console.log(req.body.bengali);
    //db.push();
    for(var i=1;i<=count;i++) {
        if(username== db.getData("/user"+i+"/name")) {
            db.push("/user" + i + "/andhra", req.body);
        }
    }
    //food_likes(username,"andhra");
    res.redirect('/food');
    res.sendStatus(200);
    db.save();
    db.reload();
});


app.post('/tamilnadu', function (req, res) {
    //console.log(req.body);
    var db = new jsondb("user_login",true,false);
    var username = req.mySession.user;
    var count = db.getData('/count');
    //console.log(req.body.bengali);
    //db.push();
    for(var i=1;i<=count;i++) {
        if(username== db.getData("/user"+i+"/name")) {
            db.push("/user" + i + "/tamilnadu", req.body);
            }
    }
   // food_likes(username,"tamilnadu");
    res.redirect('/food');
    res.sendStatus(200);
    db.save();
    db.reload();
});


app.post('/process', function (req, res) {
    //console.log(req.body);
    var db = new jsondb("user_login",true,false);
    var predb = new jsondb("preferences",true,false);
    var username = req.mySession.user;
    //get user id
    var id;
    var count = db.getData('/count');
    for(var i=1;i<= count ;i++){
        if(username== db.getData("/user"+i+"/name")) {
            id = db.getData('/user'+i+'/id');
            break;
        }
    }

    //find preferences
    for (var i=1 ;i <=count; i++){
        if(username == db.getData('/user'+i+"/name")){
            for (var j =1 ,k =1; j <=10 ; j++){
                //console.log(db.getData('/user'+i+'/andhra/item'+j));
                if(db.getData('/user'+i+'/andhra/item'+j) > 0){
                    predb.push('/user'+i+'/andhra/'+ k +'/itemname',"item"+j);
                    predb.push('/user'+i+'/andhra/'+ k++ +'/rating', db.getData('/user'+i+'/andhra/item'+j) );
                }
            }

            for (var j =1 ,k =1; j <=10 ; j++){
                //console.log(db.getData('/user'+i+'/andhra/item'+j));
                if(db.getData('/user'+i+'/tamilnadu/item'+j) > 0){
                    predb.push('/user'+i+'/tamilnadu/'+ k +'/itemname',"item"+j);
                    predb.push('/user'+i+'/tamilnadu/'+ k++ +'/rating', db.getData('/user'+i+'/tamilnadu/item'+j) );
                }
            }
        }
    }

    //find similarties

    var psum = 0;
    var sim_item1 = [], l1 = 0 , sum1= 0 , sumsq1 =0 ;
    var sim_item2 = [], l2 = 0 , sum2 =0 , sumsq2 =0 ;
    var user_name , m =1;
    var similarity =0 ;
    console.log(username);
    for(var j = 1 ; j <= count ; j++) {
        if (username != db.getData('/user' + j + '/name')) {
            user_name = db.getData('/user' + j + '/name');
            for (var m = 1; m <= predb.getData('/user' + id + '/andhra/no'); m++) {
                var item = predb.getData("/user" + id + "/andhra/" + m + "/itemname");
                console.log(item);
                //for(var j = 1 ; j <= count ; j++){

                //if (username != db.getData('/user' + j + '/name')) {
                console.log(db.getData('/user' + j + '/name'));
                for (var k = 1; k <= predb.getData('/user' + j + '/andhra/no'); k++) {
                    console.log(predb.getData('/user' + j + '/andhra/' + k + '/itemname'));
                    if (item == predb.getData('/user' + j + '/andhra/' + k + '/itemname')) {
                        sim_item1[l1++] = item;
                        psum = psum + (parseInt(predb.getData('/user' + j + '/andhra/' + k + '/rating')) * parseInt(predb.getData('/user' + id + '/andhra/' + m + '/rating')));
                        sum2 = sum2 + parseInt(predb.getData('/user' + j + '/andhra/' + k + '/rating')) ;
                        sum1 = sum1 + parseInt(predb.getData('/user' + id + '/andhra/' + m + '/rating')) ;
                        sumsq2 = sumsq2 + Math.pow( parseInt(predb.getData('/user' + j + '/andhra/' + k + '/rating')),2);
                        sumsq1 = sumsq1 + Math.pow( parseInt(predb.getData('/user' + id + '/andhra/' + m + '/rating')),2) ;
                    }
                }
                console.log(sim_item1);
            }

            for (var i = 1; i <= predb.getData('/user' + id + '/tamilnadu/no'); i++) {
                var item = predb.getData("/user" + id + "/tamilnadu/" + i + "/itemname");
                console.log(item);
                //for(var j = 1 ; j <= count ; j++){

                //if (username != db.getData('/user' + j + '/name')) {
                console.log(db.getData('/user' + j + '/name'));
                for (var k = 1; k <= predb.getData('/user' + j + '/tamilnadu/no'); k++) {
                    console.log(predb.getData('/user' + j + '/tamilnadu/' + k + '/itemname'));
                    if (item == predb.getData('/user' + j + '/tamilnadu/' + k + '/itemname')) {
                        sim_item2[l2++] = item;
                        psum = psum + (parseInt(predb.getData('/user' + j + '/tamilnadu/' + k + '/rating'))*parseInt(predb.getData('/user' + id + '/tamilnadu/' + i + '/rating')));
                        sum2 = sum2 + parseInt(predb.getData('/user' + j + '/tamilnadu/' + k + '/rating')) ;
                        sum1 = sum1 + parseInt(predb.getData('/user' + id + '/tamilnadu/' + i + '/rating')) ;
                        sumsq2 = sumsq2 + Math.pow(parseInt(predb.getData('/user' + j + '/tamilnadu/' + k + '/rating')),2) ;
                        sumsq1 = sumsq1 + Math.pow(parseInt(predb.getData('/user' + id + '/tamilnadu/' + i + '/rating')),2) ;
                    }
                }
                console.log(sim_item2);
            }


            console.log("the sumsq1 is "+ sumsq1);
            console.log("the sumsq2 is "+ sumsq2);
            var n = (l1+l2);

            if(n>0) {
                var  num =0, den =0 ;
                console.log("l1 ="+(l1) + " l2 = "+(l2));
                console.log("the sum1 is "+ sum1);
                console.log("the sum2 is "+ sum2);
                console.log("the psum is "+ psum);
                num = psum - (sum1*sum2)/n;
                console.log("num ="+num);
                den=Math.sqrt((sumsq1-Math.pow(sum1,2)/ n )*( sumsq2-Math.pow(sum2,2)/n));
                console.log("den ="+den);

                if(den == 0){
                    similarity = 0;
                }else{
                    similarity = num / den ;
                }
            }
            console.log("similarity ="+similarity);
            predb.push("/user"+id+"/similar/"+ m++ +"/id", j);
            predb.push("/user"+id+"/similar/"+ m++ +"/value", similarity);

        }
    }
    
    //select items
    //find max similar person
    var max = -1 , maxid =0;
    for(var i=1 ; i<count;i++) {
        if(max< predb.getData('/user'+id+'/similar/'+i+'/value')){
            maxid = predb.getData('/user'+id+'/similar/'+i+'/id');
            max = predb.getData('/user'+id+'/similar/'+i+'/value');
        }
    }
    //andhra
    var fooddb = new jsondb("food-items",true,false);
    var itemno ,name , k=1;
    for (var i = 1; i < predb.getData('/user'+maxid+'/andhra/no') ; i++){
        itemno = predb.getData('/user'+maxid+'/andhra/'+i+'/itemname');
        for(var j =1 ; j<10 ;j++){
            if(itemno == 'item'+j ){
                name = fooddb.getData('/andhra/item'+j);
                break;
            }
        }
        predb.push('/user'+id+'/display/item'+ k++ , name);
    }
    //tamilnadu
    for (var i = 1; i < predb.getData('/user'+maxid+'/tamilnadu/no') ; i++){
        itemno = predb.getData('/user'+maxid+'/tamilnadu/'+i+'/itemname');
        for(var j =1 ; j<10 ;j++){
            if(itemno == 'item'+j ){
                name = fooddb.getData('/tamilnadu/item'+j);
                break;
            }
        }
        predb.push('/user'+id+'/display/item'+ k++ , name);
    }
    

    res.redirect('/result');
    res.sendStatus(200);
    db.save();
    predb.save();
    db.reload();
    predb.reload();
});

//Sending msgs
app.post('/msg', function (req, res) {
    //console.log(req.body);
    var db = new jsondb("preferences",true,false);
    var restaurants = new jsondb("restaurant",true,false);
    var username = req.mySession.user;
    /*var str = "";
    
    for(var i=1;i<2;i++){//identify the user
        if(db.getData("/user"+i+"/name")==username){
            console.log("matched");
            for (var j =1 ; j<4 ;j++){//identify the item to search  for
                var item = db.getData("/user"+i+"/display/item"+j);
                console.log(item);
                for(var k =1;k<3;k++){//itearate through the restaurants
                    for(var l =1 ; l <11 ; l ++) {//iterate through the menu
                        if (item == restaurants.getData("/restaurant"+k+"/menu/item"+l)){
                            str = restaurants.getData("/restaurant"+k+"/name") + ", " + restaurants.getData("/restaurant"+k+"/address")+", "+restaurants.getData("/restaurant"+k+"/location");
                            console.log(str);
                        }
                    }
                }
            }
        }
    }*/

    var rate = [] ;
    var name = [] ;
    for (var i = 1 ; i <8 ;i++){
        rate["r"+i] = restaurants.getData('/restaurant'+i+'/rating');
        name["r"+i] = restaurants.getData('/restaurant'+i+'/name');
    }

    for ( var i =0 ; i < 7; i++){
        //var tmp = rate["r"+i];
        for(var j = i+1; j < 8 ;j++){
            if ( rate["r"+i] < rate["r"+j]){
                var tmp1 = rate["r"+j];
                rate["r"+j] = rate["r"+i];
                rate["r"+i] = tmp1;

                var tmp2 = name["r"+j];
                name["r"+j] = name["r"+i];
                name["r"+i] = tmp2;
            }
        }
    }

    for ( var i =1 ; i <6 ;i++){

        restaurants.push('/rank/rank'+i+"/name",name["r"+i]);
        restaurants.push('/rank/rank'+i+"/rate",rate["r"+i]);
    }

    console.log(rate);
    console.log(name);
    res.redirect('/direction');
    res.sendStatus(200);
    restaurants.save();
    restaurants.reload();
    db.save();
    db.reload();
    //sendmsg("hi");

});

app.post('/rate', function (req, res) {
    //console.log(req.body);
    var db = new jsondb("restaurant",true,false);
    var res_name = req.body.name;
    var username = req.mySession.user;
    for(var i=1;i<8;i++) {
        if(res_name== db.getData("/restaurant"+i+"/name")) {
            var rate1 = db.getData("/restaurant"+i+"/rating");
            var rate2 = req.body.rating;
            console.log(parseInt(rate1));
            console.log(parseInt(rate2));
            console.log(parseInt(rate1)+parseInt(rate2));

            db.push("/restaurant"+i+"/rating", (parseInt(rate1)+parseInt(rate2))/2 );
            break;
        }
    }
    res.redirect('/');
    res.sendStatus(200);
    db.save();
    db.reload();
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app;
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
