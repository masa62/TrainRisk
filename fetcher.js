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

/** schema definition ended ***/

var lastRefleshed = new Date(70, 0, 1, 9, 0, 0);

function init() {

  Info.find({}, function(err, docs) {

    var item;
    if (docs.length === 0) {
      item = new Info();
    }
    else {
      item = docs[0]
      lastRefleshed = item["last-up-date"];
    }
    item["last-up-date"] = new Date();
    item.save(function (err) {
      if (err) log.ERROR(err);
    });

    log.debug("last up date is " + lastRefleshed);

    var metro = [
        "ginza", "marunouchi", "hibiya", "touzai", "chiyoda",
        "yurakucho", "hanzoumon", "nanboku", "fukutoshin"
    ];
    for (var i = 0; i < metro.length; i ++) {
        getDelayData(metro[i]);
    }
  });
}

function getDelayData(name) {

  var info = [],
    options = {
      host: 'www.tokyometro.jp',
      port: 80,
      path: '/unkou/history/' + name + '.html'
    };

  http.get(options, function (res) {
    var body = "";
    var lastModified = new Date(res.headers["last-modified"]);
    if (lastModified > lastRefleshed) {
      log.debug("***[" + name + "] is modified");
    }
    else {
     log.debug("***[" + name + "] is updated");
     return;
    }
    res.on('data', function (data) {
      body += data;
    });
    res.on('end', function () {

      var document = jsdom(body, null, {features: {
          FetchExternalResources: false,
          ProcessExternalResources: false
        }}),
        table = document.getElementsByTagName("table")[0],
        events = table.getElementsByTagName("tr");

      Train.find({name: name}, function (err, docs) {

        var train;
        if (docs.length === 0) {
         train = new Train();
         train.name = name;
        }
        else {
         train = docs[0];
        }

        var tinfo = {};
        for (var i = 1; i < events.length; i ++) {
          var event = events[i],
              tds = event.getElementsByTagName("td"),
              time = tds[0],
              cause = tds[1],
              date = time.firstChild.textContent.match(/(\d+)月(\d+)日/),
              clock = time.childNodes[1].textContent.match(/(\d+)時(\d+)分/),
              isnormal = cause.textContent.indexOf("【") == -1,
              text = cause.childNodes[0].textContent,
              status = isnormal? "平常" : text.slice(1, text.length-1),
              match = cause.textContent.match(/(\d+)時(\d+)分/),
              date_obj = new Date();
          date_obj.setMonth(date[1]-1);
          date_obj.setDate(date[2]);
          date_obj.setHours(clock[1]);
          date_obj.setMinutes(clock[2]);
          log.debug("occured date : " + date_obj);

          if (date_obj < lastRefleshed) {
           break;
          }
          if (isnormal) {
            if (i != 1) {
              train.info.push(tinfo);
              info.push(tinfo);
            }
            tinfo = {};
            tinfo["end"] = clock[1] + ":" + clock[2];
            tinfo["end-date"] = date[1] + "/" + date[2];
            continue;
          }
          tinfo["cause"] = status;
          tinfo["start"] = clock[1] + ":" + clock[2];
          tinfo["start-date"] = date[1] + "/" + date[2];
        }

        train.info.push(tinfo);
        if (!tinfo.start) {
         return;
        }
        info.push(tinfo);
        train.save(function (err) {
          if (err) log.error(err);
        });
      });
    });
  });
}

init();
