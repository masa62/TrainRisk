var jsdom = require('jsdom').jsdom,
    http = require('http'),
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
    len: Number,
    count: Number,
    "avr-passenger": Number,
    "last-up-date": Date
});
var Info = new Schema({
  "last-up-date": Date,
  "first-logging-date": Date
});

mongoose.model('Train', Train);
mongoose.model('Info', Info);
Train = mongoose.model('Train');
Info = mongoose.model('Info');

Info.find({}, function (err, docs) {
  var info = docs[0] || new Info();
  info["first-logging-date"] = new Date(2012, 2-1, 6);
  info["last-up-date"] = new Date(2000, 0, 1);
  info.save();
});

Train.find({name: "ginza"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 14.3;
  train["avr-passenger"] = 1016;
  train.count = 360;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "marunouchi"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 27.4;
  train["avr-passenger"] = 1067;
  train.count = 336;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "hibiya"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 20.3;
  train["avr-passenger"] = 1063;
  train.count = 284;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "touzai"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 30.8;
  train["avr-passenger"] = 1218;
  train.count = 286;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "chiyoda"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 24.0;
  train["avr-passenger"] = 1050;
  train.count = 234;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "yurakucho"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 28.3;
  train["avr-passenger"] = 779;
  train.count = 200;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "fukutoshin"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 11.9;
  train["avr-passenger"] = 0;
  train.count = 200;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "hanzoumon"}, function (err, docs) {
  var train = docs[0] || new Train();
  if (!train) {
    train = new Train();
    train.name = "hanzoumon";
  }
  train.len = 16.8;
  train["avr-passenger"] = 753;
  train.count = 230;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});

Train.find({name: "nanboku"}, function (err, docs) {
  var train = docs[0] || new Train();
  train.len = 21.3;
  train["avr-passenger"] = 382;
  train.count = 180;
  var del = [];
  for (var i = 0; i < train.info.length; i ++) {
    if (!train.info[i].start) {
      del.push(i);
    }
  }
  for (var i = del.length - 1; i >= 0; i --) {
    train.info[del[i]].remove();
  }
  train.save();
});
