const express = require("express");
const mongoose = require('mongoose');
const registerRouter = require('./routes/register');
const app = express();
var bodyParser = require('body-parser');
/* var urlencodedParser = bodyParser.urlencoded({ extended: false }); */

/* // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json()); */

app.use(express.static('public'));
app.use('/', express.static(__dirname + '/picture'));
let engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/evoting', {useNewUrlParser: true});

app.get('/', function (req, res) {
  res.render('index');
});

app.use('/register', registerRouter);

var server = app.listen(8000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})