const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/evoting', {
    useNewUrlParser: true
}).then(() => {
  const fruitSchema = new mongoose.Schema({
    name: {type: String},
    rating: {type: Number},
    review: {type: String}
  }, {versionKey: false});// You should be aware of the outcome after set to false
  
  const Fruit = mongoose.model("users", fruitSchema);
 
  var fruit = new Fruit({
      name: "Apple",
      rating: 7,
      review: "Taste Good"
  });
  

  fruit.save();
  console.log("connected!");
}).catch((error) => {
  console.log("error! fuck\n", error);
})
