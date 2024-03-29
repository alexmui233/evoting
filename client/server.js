const express = require("express");
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const createeventRouter = require('./routes/createevent');
const mycreateeventRouter = require('./routes/mycreateevent');
const alleventRouter = require('./routes/allevent');
const voteRouter = require('./routes/vote');
const myjoinedeventRouter = require('./routes/myjoinedevent');
const resultRouter = require('./routes/result');
const profileRouter = require('./routes/profile');
const myvotingrecordRouter = require('./routes/myvotingrecord');
const app = express();
var filter = require('content-filter');
var bodyParser = require('body-parser');
const session = require("express-session");
const cookieParser = require("cookie-parser");

// parse application/json
app.use(bodyParser.json());
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


app.use(express.static('public'));
app.use('/', express.static(__dirname + '/picture'));
let engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('index', {username: ""});
});

app.get('/index', function (req, res) {
  if (req.session.username !== "" && req.session.username !== undefined){
    res.render('index', {username: req.session.username});
  }  else{
    res.render('index', {username: ""});
  }
  
});

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/createevent', createeventRouter);
app.use('/mycreateevent', mycreateeventRouter);
app.use('/allevent', alleventRouter);
app.use('/vote', voteRouter);
app.use('/myjoinedevent', myjoinedeventRouter);
app.use('/result', resultRouter);
app.use('/profile', profileRouter);
app.use('/myvotingrecord', myvotingrecordRouter);
app.listen(8000);