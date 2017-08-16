var pubnub = require("pubnub")({
    subscribe_key: 'demo' // always required
});

var plotly = require('plotly')('anmolonruby','IUFcBwCrvYBnPhTPSFc0');
var stream_token = 'n2g7l2m0la'

var initData = [{
    x:['Event1', 'Event2', 'Event3'], 
    y:[],
    name: 'sample',
    type: 'bar', 
    stream:{
        token: stream_token, 
        maxpoints:200
    }
}];

var layout = {barmode: "stack"};
var initGraphOptions = {fileopt : "extend", filename : "pubnub-plotly-file", layout: layout};

plotly.plot(initData, initGraphOptions, function (err, msg) {
  if (err) return console.log(err)
  console.log(msg);
  
  function randomIntInc (low, high) {
      return Math.floor(Math.random() * (high - low + 1) + low);
  }

  var stream1 = plotly.stream(stream_token, function (err, res) {
    console.log(err, res);
    clearInterval(loop2); // once stream is closed, stop writing

  });

  var loop = setInterval(function () {
      var streamObject = JSON.stringify({y : [randomIntInc(0,9), randomIntInc(0,9), randomIntInc(0,9)] });
      stream1.write(streamObject+'\n');
  }, 1000);

  var loop2 = function () {
    pubnub.subscribe({
        channel: "pubnub-plotly",
        message : function(message){
            var arr = new Array(3)
            message.find(function(event){
                if (event.event_name == "Event1"){
                    arr[0] = event.data ;
                } else if (event.event_name == "Event2"){
                    arr[1] = event.data ;
                } else if (event.event_name == "Event3"){
                    arr[2] = event.data ;
                }
            })
            console.log(arr);
            var streamObject = JSON.stringify({y : arr });
            console.log(streamObject);
            stream1.write(streamObject+'\n');
        }
    });
  };
});