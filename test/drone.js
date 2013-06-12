var server = require('../server.js'),
    expect = require('expect.js'),
    assert = require('assert'),
    Browser = require('zombie'),
    http = require('http'),
    browser = new Browser({debug:false}),
    Testserver= 0,
    socket = 0,
    imageSendingPaused = false,
    faye = require('faye'),
    drone = require('ar-drone').createClient();
    var client;
    var droneBool = false;


describe('Check if the drone is connected and ', function(){

    before(function(){
        Testserver = http.createServer(server).listen(server.get('port'), function(){
            console.log("Express server listening on port " + server.get('port'));
        });
        browser.site = 'localhost:'+server.get('port');
        //browser.loadCSS = false;
        browser.runScripts = true;

        //Necessary that client javascript is finished
        browser.waitFor = 1750;
        drone.config('general:navdata_demo','TRUE');
        var currentImg;
        var adapter = new faye.NodeAdapter({
            mount:'/faye',
            timeout:45
        });
        adapter.attach(Testserver);
        socket = new faye.Client("http://localhost:" + (server.get("port")) + "/faye");

        drone.on('navdata', function(data) {
            return socket.publish("/drone/navdata", data);
        });

        imageSendingPaused = false;
        currentImg = null;
        drone.createPngStream().on("data", function(frame) {
            console.log('im png stream');
            currentImg = frame;
            if (imageSendingPaused) {
                return;
            }
            socket.publish("/drone/image", "/image/" + (Math.random()));
            imageSendingPaused = true;
            return setTimeout((function() {
                imageSendingPaused = false;
            }), 100);
        });
        socket.subscribe("/drone/move", function(cmd) {
            var _name = cmd.action;
            console.log("move", cmd);
            return typeof drone[_name = cmd.action] === "function" ? drone[_name](cmd.speed) : void 0;
            /*if(drone.[_name] === 'function') {
             drone[name](cmd.speed);
             }*/
        });
        socket.subscribe("/drone/drone", function(cmd) {
            var _name;
            console.log('drone command: ', cmd);
            droneBool = true;
            return typeof drone[_name = cmd.action] === "function" ? drone[_name]() : void 0;
        });


        socket.subscribe("/drone/animate", function(cmd) {
            console.log('animate', cmd);
            return drone.animate(cmd.action, cmd.duration);
        });


        server.get("/image/:id", function(req, res) {
            res.writeHead(200, {
                "Content-Type": "image/png"
            });
            console.log(currentImg);
            return res.end(currentImg, "binary");
        });
        client = new faye.Client('http://localhost:3000/faye');
    });

    after(function(){
        Testserver.close();
        browser.close();

    });
 
/*    it('shows the battery status of the drone (only if drone is connected)' , function(done){
        browser.visit("/connect", function () {
            expect(browser.success).to.equal(true);
            expect(browser.location.pathname).to.equal('/connect');
            expect(browser.text("title")).to.equal('Node-Copter');
            setTimeout(function() {
                expect(parseInt(browser.text("#batteryPercentage"))).to.be.lessThan(100);
                done();  
            },4000);
            
        });
    });

    it('shows the live stream (only if drone is connected)' , function(done){
        browser.visit("/connect", function () {
            expect(browser.success).to.equal(true);
            expect(browser.location.pathname).to.equal('/connect');
            function mapLoaded(window) {
              return window.document.querySelector("#cam");
            }
            browser.wait(mapLoaded, function() {
                // Page has a #cam element now
                setTimeout(function() {
                  expect(browser.html("#cam")).to.equal('<img id="cam" src="default.jpg" />');
                  done();
                },4000);
            });
        });
    });*/

   it('shows that a faye packet will arrive when takeoff button is pressend' , function(done){
        browser.visit("/connect", function () {
            expect(browser.success).to.equal(true);
            expect(browser.location.pathname).to.equal('/connect');
            function mapLoaded(window) {
                return window.document.querySelector(".btn-success");
            }

            browser.wait(mapLoaded, function() {
                // Page has a #btn-success element now
                browser.pressButton(".btn-success", function() {
                    console.log(droneBool);  
                    expect(droneBool).to.equal(true);
                    droneBool = false;
                    done();    
                });
            });
        });
    });
   
   it('shows that a faye packet will arrive when publish in test' , function(done){
        client.publish('/drone/drone', { action: 'takeoff' });
        //setTimeout is necessary bcs it takes time until the packet arrived 
        setTimeout(function(){
            expect(droneBool).to.equal(true);
            droneBool = false;
            done();
        },100);
    });
});

