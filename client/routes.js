const express = require("express");
// const userModel = require("./models");
const app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use('/public', express.static('public'));
let engine = require('ejs-locals');
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, "js")));

app.get('/', function (req, res) {
  res.render('index');
})

/* app.get('/index.html', function (req, res) {
  res.sendFile( __dirname + "/" + "index.html" );
}) */

app.post("/add_user", async (request, response) => {
  const user = new userModel(request.body);

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});
app.post('/process_post', urlencodedParser, function (req, res) {
 
  // 输出 JSON 格式
  var response = {
      "first_name":req.body.first_name,
      "last_name":req.body.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
})

var server = app.listen(8000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})