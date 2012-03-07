var jsdom = require('jsdom').jsdom,
    http = require('http'),
    mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    Log = require("log"),
    log = new Log(Log.DEBUG);

mongoose.connect("mongodb://localhost/train");

/** mongodb schema definition **/

var TrainInfo = new Schema({
    start: String,
    end: String,
    cause: String,
    "start-date": String,
    "end-date": String
});

var Train = new Schema({
    name: String,
    count: Number,
    len: Number,
    "avr-passenger": Number,
    info: [TrainInfo],
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

/** schema definition ended ***/

//startは2/6, 31日
var start_date = new Date();
function pre() {
  Info.find({}, function (err, docs) {
    start_date = docs[0]["first-logging-date"];
    init();
  });
}

function init() {

  var metro = [
      "ginza", "marunouchi", "hibiya", "touzai", "chiyoda",
      "yurakucho", "hanzoumon", "nanboku", "fukutoshin"
  ],
      diff = Math.ceil((new Date() - start_date) / 86400000);
  log.debug("ロギング開始から" + diff + "日経過しています");

  for (var i = 0; i < metro.length; i ++) {

    Train.find({name: metro[i]}, function (err, docs) {

      if (!docs[0]) { return; }
      log.debug("docs id: " + docs[0]._id);
      var avr_delay = 0,
          name = docs[0].name,
          status = docs[0].info;
      for (var j = 0; j < status.length; j ++) {

        var info = status[j];
        if (!info.start) continue;

        var start = info.start.split(":"),
            end = info.end.split(":"),
            dh = Number(end[0]) - Number(start[0]),
            dm = Number(end[1]) - Number(start[1]);
        if (dm < 0) {
          dh --;
          dm += 60;
        }
        if (dh < 0) {
          dh += 24;
        }
        log.debug(name + "の" + info["start-date"] + "の遅延時間は" + dh + "時間" + dm + "分です．");
        avr_delay += dh * 60 + dm;
      }
      var count = status.length,
          train = docs[0];
      log.debug(name + "の合計遅延時間は" + avr_delay + "分です");
      log.debug(name + "の平均遅延時間は" + (avr_delay/count) + "分です");
      log.debug(name + "の日あたりの平均遅延時間は" + (avr_delay/diff) + "分です");
      log.debug(name + "の事故頻度は" + (count/diff) + "回/日です");
      log.debug(name + "の平均事故率は" + (count / (train.count * train.len)) + "です");
    });
  }
}

pre();
