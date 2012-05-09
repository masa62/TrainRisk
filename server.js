var jsdom = require('jsdom').jsdom,
    sys = require('util'),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    express = require("express"),
    app = express.createServer();

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

app.configure("development", function() {
    app.use(express.static(__dirname + "/public"));
});

/*
app.get("/", function (req, res) {
    Train.find({}, function (err, docs) {
        res.send(docs);
    });
});
*/

app.get("/trains/:name", function (req, res) {
    Train.find({name:req.params.name}, function (err, docs) {
        if (err) res.send("not found");
        else {
            res.contentType("json");
            res.send(docs);
        }
    });
});

app.listen(3000);

/*
Train.find({}, function (err, docs) {
    console.log(docs);
    Info.find({}, function (err, docs){
      console.log(docs);;
    });
});
*/
