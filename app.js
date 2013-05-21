
/**
 * Module dependencies.
 */


var http = require('http'),
    server = require('./server'),
    faye = require('faye'),
    drone = require('ar-drone').createClient(),
    imageSendingPaused = false,
    RecordingImgs = [], //stack for img
    recording = false,
    VideoMaker = require('./videomaker');
    redisCli = require('./redisClient');

 
drone.config('general:navdata_demo','TRUE');

//Turning NAV-DATA on
drone.config('general:navdata_demo','TRUE');

module.exports = httpServer = http.createServer(server).listen(server.get('port'), function(){
  console.log("Express server listening on port " + server.get('port'));
});

var adapter = new faye.NodeAdapter({
    mount:'/faye',
    timeout:45
});
adapter.attach(httpServer);

socket = new faye.Client("http://localhost:" + (server.get("port")) + "/faye");

//Creating PNG-Stream and naming every Image with a unix-timestamp
//png with timestamp is going to be used for qr-code decetion afterwards
drone.createPngStream().on("data", function(frame) {
    currentImg = frame;
    if(recording) {
        RecordingImgs.push(frame);
    }
    if (imageSendingPaused) {
        return;
    }
    var seconds = new Date().getTime();
    socket.publish("/drone/image", "/image/" + (seconds));

    imageSendingPaused = true;
    return setTimeout((function() {
        return imageSendingPaused = false;
    }), 100);
});

//Drone-Commands for either fly in a direction, perform an animation
//or do hard-coded moves (takeOff, land, recover)
socket.subscribe("/drone/move", function(cmd) {
    var _name = cmd.action;
    console.log("move", cmd);
    return typeof drone[_name = cmd.action] === "function" ? drone[_name](cmd.speed) : void 0;
});

socket.subscribe("/drone/animate", function(cmd) {
    console.log('animate', cmd);
    return drone.animate(cmd.action, cmd.duration);
});

socket.subscribe("/drone/drone", function(cmd) {
    var _name;
    console.log('drone command: ', cmd);
    return typeof drone[_name = cmd.action] === "function" ? drone[_name]() : void 0;
});

socket.subscribe("/drone/recording", function() {
    if(recording) {
        //ToDo: RecordingImgs get them and in ordner and make video
        //was ist in jedem array element!
        VideoMaker.makeVideo(function(filename) {
            socket.publish("/drone/newvideo", "/video/" + (filename));
            recording = false;
        });
    }
    else {
        recording = true;
    }
});

socket.subscribe("/drone/qrcode", function(data) {
    var code = data.code;
    console.log("QRCODE arrived at server");
    redisCli.saveToRedis(code,function(count,key) {
       socket.publish("/drone/qrcodecounter", {
            key:key,
            count:count
       }); 
    });
});


drone.on('navdata', function(data) {
    return socket.publish("/drone/navdata", data);
});

//Server getting the Image from Livestream
server.get("/image/:id", function(req, res) {
    res.writeHead(200, {
        "Content-Type": "image/png"
    });
    return res.end(currentImg, "binary");
});