
/**
 * Module dependencies.
 */
var folder = '', 
	drone = require('ar-drone').createClient(),
    imageSendingPaused = false,
    recording = false,
    VideoMaker = require('./videomaker'),
	faye = require('faye'),
    crypto = require('crypto'),
    token = '0',
    fs = require('fs'),
    redisCli = require('./redisClient'),
    droneInUse = false,
	http = require('http'),
    server = require('./server');


module.exports = httpServer = http.createServer(server).listen(server.get('port'), function(){
  console.log("Express server listening on port " + server.get('port'));
});



//Server getting the Image from Livestream
server.get("/image/:id", function(req, res) {
    res.writeHead(200, {
        "Content-Type": "image/png"
    });
    res.end(currentImg, "binary");
});

//***** Faye communication ******

var serverAuth = {
    incoming: function(message, callback) {
        if(message.channel === '/drone/drone' || message.channel === '/drone/move' || message.channel === '/drone/animate' || message.channel === '/drone/recording' || message.channel === '/drone/qrcode' || message.channel === '/drone/saveImage' || message.channel === '/drone/release') {
            var msgToken = message.ext && message.ext.token;
            if (token !== msgToken) {
                message.error = 'Invalid auth token';
            }
        }
        callback(message);
    }
};

var setNewToken = function(callback) {
    crypto.randomBytes(48, function(ex, buf) {
        token = buf.toString('hex');
        if(typeof callback === 'function') {
            callback();
        }
    });
};

var adapter = new faye.NodeAdapter({
    mount:'/faye',
    timeout:45
});

//Drone-Commands for either fly in a direction, perform an animation
//or do hard-coded moves (takeOff, land, recover)
adapter.getClient().subscribe("/drone/move", function(cmd) {
    moveAction(cmd);
});

adapter.getClient().subscribe("/drone/animate", function(cmd) {
    animateAction(cmd);
});

adapter.getClient().subscribe("/drone/drone", function(cmd) {
    droneAction(cmd);
});

adapter.getClient().subscribe("/drone/recording", function() {
    record();
});

adapter.getClient().subscribe("/drone/qrcode", function(data) {
    var code = data.code;
    redisCli.saveToRedis(code,function(count,key) {
        if(count !== 0) {
            adapter.getClient().publish("/drone/qrcodecounter", {
                key:key,
                count:count
            });
        }
    });
});

adapter.getClient().subscribe("/drone/saveImage", function(){
    snap();
});

adapter.getClient().subscribe("/drone/getToken", function(data){
    console.log(data);
    if(!droneInUse) {
        droneInUse = true;
        setNewToken(function(){
            adapter.getClient().publish("/drone/token/"+data.guid, {
                token:token,
                state:droneInUse
            });
        });
    }
    else {
        adapter.getClient().publish("/drone/token/"+data.guid, {
            token:0,
            state:droneInUse
        });
    }
});

adapter.getClient().subscribe("/drone/release", function(){
    console.log('drone released');
    setNewToken(function() {
        adapter.getClient().publish("/drone/freeDrone", {state:true});
        droneInUse = false;
    });
});

adapter.getClient().subscribe('/drone/halloffame', function(data) {
    redisCli.setNames(data.data, function() {
      adapter.getClient().publish("/drone/newgame/"+data.guid, {});  
    });
});

adapter.addExtension(serverAuth);
adapter.attach(httpServer);

drone.on('navdata', function(data) {
    adapter.getClient().publish("/drone/navdata", data);
});

drone.config('general:navdata_demo','TRUE');

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
    adapter.getClient().publish("/drone/image", "/image/" + (seconds));

    imageSendingPaused = true;
    return setTimeout((function() {
        imageSendingPaused = false;
    }), 200);
});

var droneAction = function(cmd) {
    var _name;
    console.log('dronecommand:', cmd);
    return typeof drone[_name = cmd.action] === "function" ? drone[_name]() : void 0;
};

var moveAction = function(cmd) {
    var _name = cmd.action;
    console.log("move", cmd);
    return typeof drone[_name = cmd.action] === "function" ? drone[_name](cmd.speed) : void 0;
};

var animateAction = function(cmd) {
    console.log('animate', cmd);
    drone.animate(cmd.action, cmd.duration);
};

var record = function() {
    if(recording) {
        VideoMaker.makeVideo('./video/'+folder+'/',function(filename) {
            adapter.getClient().publish("/drone/newvideo", "/video/" + (filename));
            recording = false;
        });
    }
    else {
        var d = new Date();
        folder = d.getTime();
        fs.mkdirSync('video/'+folder);
        recording = true;
    }
};

var snap = function() {
    var imagedata = '';
    var d = new Date();
    var imageName = "droneImage"+d.getTime()+".png";
    if(typeof currentImg !== 'undefined') {
        fs.writeFile('picture/'+imageName, currentImg, 'binary', function(err){
            if(err) throw err;
        });
    }
};



