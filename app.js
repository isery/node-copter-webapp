
/**
 * Module dependencies.
 */


var http = require('http'),
    server = require('./server'),
    faye = require('faye'),
    drone = require('ar-drone').createClient(),
    imageSendingPaused = false,
    folder = '',
    recording = false,
    VideoMaker = require('./videomaker'),
    fs = require('fs'),
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
    var seconds = new Date().getTime();
    if(recording) {
        fs.writeFile('video/'+folder+'/'+seconds+'.png', currentImg, 'binary', function(err){
            if(err) throw err;
        });
    }
    if (imageSendingPaused) {
        return;
    }
    socket.publish("/drone/image", "/image/" + (seconds));

    imageSendingPaused = true;
    return setTimeout((function() {
        return imageSendingPaused = false;
    }), 1000);
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
        VideoMaker.makeVideo('./video/'+folder+'/',function(filename) {
            socket.publish("/drone/newvideo", "/video/" + (filename));
            recording = false;
        });
    }
    else {
        var d = new Date();
        folder = d.getTime();
        fs.mkdirSync('video/'+folder); 
        recording = true;
    }
});

socket.subscribe("/drone/qrcode", function(data) {
    var code = data.code;
    redisCli.saveToRedis(code,function(count,key) {
       socket.publish("/drone/qrcodecounter", {
            key:key,
            count:count
       }); 
    });
});

socket.subscribe("/drone/saveImage", function(){
    var imagedata = '';
    var d = new Date();
    var imageName = "droneImage"+d.getTime()+".png";
    fs.writeFile('picture/'+imageName, currentImg, 'binary', function(err){
        if(err) throw err;
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
    res.end(currentImg, "binary");
});


