var chart;

var trains = [
    ["ginza", "銀座線"],
    ["marunouchi", "丸ノ内線"],
    ["hibiya", "日比谷線"],
    ["touzai", "東西線"],
    ["chiyoda", "千代田線"],
    ["yurakucho", "有楽町線"],
    ["hanzoumon", "半蔵門線"],
    ["nanboku", "南北線"],
    ["fukutoshin", "副都心線"]
];
var accidents = {};

var options = {};

function getTrainInfo(id) {
    if (id === trains.length) {
        renderChart(0);
        return;
    }
    options.xAxis.categories.push(trains[id][0]);
    $.get("/trains/" + trains[id][0], function (data) {
        accidents[trains[id][0]] = {
            name: trains[id][1],
            delay_time: 0,
            count: 0
        };
        var acc = accidents[trains[id][0]];
        for (var i = 0; i < data[0].info.length; i ++) {
            var info = data[0].info[i];
            console.log(info);
            var start = info.start.split(":"),
                end = info.end.split(":");
            var dh = end[0] - start[0],
                dm = end[1] - start[1];
            if (dm < 0) {
                dh --;
                dm += 60;
            }
            if (dh < 0) {
                dh += 24;
            }
            acc["delay_time"] += dh * 60 + dm;
            acc["count"] ++;
        }
        accidents[trains[id][0]] = acc;
        console.log(acc);
        getTrainInfo(id+1);
    });
}

$(document).ready(function() {
    options = {
        chart: {
            renderTo: "container",
            type: "bar",
        },
        plotOptions: {
            series: {
                lineWidth: 5
            }             
        },
        xAxis: {
            categories: [],
        },
        yAxis: {
            labels: {}
        },
        title: {
            text: "delay"
        },
        series: [{
            name: "障害回数",
            data: []
        },
        {
            name: "障害時間合計",
            data: []
        },
        {
            name: "平均障害時間",
            data: []
        }]
    };
    getTrainInfo(0);
});

function isin(name) {
    for (var i = 0; i < trains.length; i ++) {
        if (trains[i][0] === name) {
            return true;
        }
    }
    return false;
}

function change(idx) {
    options.series[0].data = [];
    options.series[1].data = [];
    options.series[2].data = [];
    renderChart(idx);
}

function renderChart(type) {
    var count = 0;
    for (var name in accidents) {
        console.log(name);
        if (!isin(name)) {
            continue;
        }
        var acc = accidents[name];
        if (type === 0) {
            options.series[0].data.push(acc.count);
        }
        if (type === 1) {
            options.series[1].data.push(acc["delay_time"]);
        }
        if (type === 2) {
            options.series[2].data.push(acc["delay_time"] / acc.count);
        }
        count ++;
    }
    console.log(count);
    chart = new Highcharts.Chart(options);
}
