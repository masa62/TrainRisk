var jsdom = require('jsdom').jsdom,
    sys = require('sys'),
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
    "last-up-date": Date
});

mongoose.model('Train', Train);
Train = mongoose.model('Train');

function show(name, data) {
//    console.log("-----" + name + "-----");
//    console.log(data);
//    console.log("---------------");
    Train.find({}, function (err, docs) {
        console.log(docs);
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
        res.on('data', function (data) {
            body += data;
        });
        res.on('end', function () {
            //console.log(body);
            var document = jsdom(body),
                table = document.getElementsByTagName("table")[0],
                events = table.getElementsByTagName("tr");
            var train = new Train();
            train.name = name;
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
                    match = cause.textContent.match(/(\d+)時(\d+)分/);
                //console.log(status);
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
            train.save(function (err) {
                if (err) console.log(err);
            });
            show(name, info);
        });
    });
}

var metro = [
    "ginza", "marunouchi", "hibiya", "touzai", "chiyoda",
    "yurakucho", "hanzoumon", "nanboku", "fukutoshin"
];
for (var i = 0; i < metro.length; i ++) {
    var delay = getDelayData(metro[i]);
}
