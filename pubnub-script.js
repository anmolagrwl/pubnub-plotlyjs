var pubnub = require("pubnub")({
    subscribe_key: 'demo', // always required
    publish_key: 'demo'	// only required if publishing
});
var cron = require('cron');

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

var cronJob = cron.job("*/1 * * * * *", function(){
    var data = [
        {
            "event_name": "Event1",
            "data": randomIntInc(0,9)
        },
        {
            "event_name": "Event2",
            "data": randomIntInc(0,9)
        },
        {
            "event_name": "Event3",
            "data": randomIntInc(0,9)
        }
    ]

    pubnub.publish({
        channel: "pubnub-plotly",
        message: data,
        callback: function(m){console.log(m)}
    });
});

cronJob.start();