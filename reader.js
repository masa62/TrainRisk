var jsdom = require('jsdom').jsdom,
    sys = require('util'),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost/train");
var TrainInfo = new Schema({
    start: String,
    end: String,
    cause: String,
    "start-date": String,
    "end-date": String
});

var Train = new Schema({
    name: String,
    info: [TrainInfo],
    "last-up-date": Date
});
var Info = new Schema({
  "last-up-date": Date
});

mongoose.model('Train', Train);
mongoose.model('Info', Info);
Train = mongoose.model('Train');
Info = mongoose.model('Info');
Train.find({}, function (err, docs) {
    console.log(docs);
    Info.find({}, function (err, docs){
      console.log(docs);;
    });
});

