const express = require("express");
const mongoose = require('mongoose');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const app = express();
var filter = require('content-filter');
var bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

/* var Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:8545");
async function getBlockNumber() {
  const latestBlockNumber = await web3.eth.getBlockNumber()
  console.log("latestBlockNumber", latestBlockNumber)
  return latestBlockNumber
}

getBlockNumber() */

/* const provider = window.ethereum;
if (typeof provider !== 'undefined') {
  console.log('get window fail');
  // state.web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    // typeof window.ethereum.enable();
    // Accounts now exposed
  } catch (error) {
    // User denied account access...
  };
} else {
  console.log('get window successful');
}; */


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(filter());


app.use(session({
  secret: 'mySecret',
  name: '', 
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60},
  resave: false, 
  secure: true
}));
app.use(cookieParser());

// parse application/json
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/', express.static(__dirname + '/picture'));
let engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/evoting', {useNewUrlParser: true});

app.get('/', function (req, res) {
  res.render('index', {username: ""});
});

app.get('/index', function (req, res) {
  console.log("undefined req.session.username: ", req.session.username);
  if (req.session.username !== "" && req.session.username !== undefined){
    res.render('index', {username: req.session.username});
    console.log('get req.session: ', req.session);
    console.log('get req.session:', req.sessionID);
  }  else{
    res.render('index', {username: ""});
    console.log(req.session);
    console.log(req.sessionID);
  }
  
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.listen(8000);