require("./database");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Router = require("./routes")
// mongoose.connect("mongodb://localhost:27017/evoting");

/* const dogSchema = new mongoose.Schema({
    name: String,
    age: Number,
    breed: String
});
const Dog = mongoose.model("Dog", dogSchema);
const dog = new Dog({
    name: "Rex",
    age: 1,
    breed: "Golden Retriever"
   }); */

const conndb = async () => {
    /* const uri = "mongodb://localhost:27017";  
    const client = new MongoClient(uri); */
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect("mongodb://localhost:27017/evoting");

        const fruitSchema = new mongoose.Schema({
        name: {type: String},
        rating: {type: Number},
        review: {type: String}
        });
        
        const Fruit = mongoose.model("Fruit", fruitSchema);
        
        const fruit = new Fruit({
            name: "Apple",
            rating: 7,
            review: "Taste Good"
        });
          
        fruit.save();
        /* const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error: "));
        db.once("open", function () {
        console.log("Connected successfully");
        });
 */
        // listDatabases(mongoose);

    } catch (e) {
        console.error(e);
    }/* finally {
        await client.close();
    } */
}
module.exports = conndb;
/* conndb();

dog.save(); */
// app.use(Router);
app.listen(8000, () => {
        console.log("hello 8000");
    }

);
// Dog.insertOne(dog, function(err{}));


/* const {MongoClient} = require('mongodb');
async function main() {
    const uri = "mongodb://localhost:27017";  
    const client = new MongoClient(uri);
    try {
        await client.connect();

        await listDatabases(client);

    } catch (e) {
        console.error(e);
    }finally {
        await client.close();
    }
}
main().catch(console.error); */


/* var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("evoting");
  var myobj = { name: "Company Inc", address: "Highway 37" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}); */
// db = MongoClient.connect("mongodb://localhost:27017");
/* db["evoting"].collec
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost', // assign your host name
  user: 'root',      //  assign your database username
  password: '',      // assign your database password
  database: 'poll' // assign database Name
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn; */


/* define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root');//webserver
define('DB_PASSWORD', '');//eie3117
define('DB_NAME', 'poll');
 
//Attempt to connect to MySQL database
$pdo = new PDO("mysql:host=" .DB_SERVER."; dbname=" .DB_NAME, DB_USERNAME, DB_PASSWORD);
$pdo->exec("SET CHARACTER SET utf8");
//turn on errors in the form of exceptions
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); */
