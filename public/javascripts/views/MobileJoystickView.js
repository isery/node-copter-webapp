define(['jQuery', 'logger', 'joystick'], function($, logger) {
	var MobileJoystickView = function (model, droneFaye, $element, guid) {
		this.model = model;
		this.droneFaye = droneFaye;
        this.element=$element;
        this.maxSpeed = 0.7;
        this.guid = guid;
        this.speed= {
            clockwise: 0,
            counterClockwise: 0,
            up: 0,
            down: 0
        };
        this.dxbool = true;
        this.dybool = true;
        this.myContainer = document.getElementById('mobileJoystick');
        
        var that = this;
        this.render();

        $("*[data-action]").on("click", function(ev) {
            that.droneFaye.publish("/drone/" + $(this).attr("data-action"), {
                action: $(this).attr("data-param")
            });
        });

        $('#release').on('click', function(ev) {
            if(!$(this).hasClass('disabled')) {
                that.droneFaye.publish("/drone/release",{});
            }
        });

        $('#token').on('click', function(ev) {
            if(!$(this).hasClass('disabled')) {
                console.log('clicked'+that.guid);
                that.droneFaye.publish("/drone/getToken", {
                    guid: that.guid
                });
            }
        });

        this.joystick   = new VirtualJoystick({
                container   : this.myContainer,
                mouseSupport  : true
        });
        setInterval(function(){
            var dx = that.joystick.deltaX();
            var dy = that.joystick.deltaY();

            if(dx<50 && dx>-50 && that.dxbool) {
                that.speed.clockwise = 0;
                that.speed.counterClockwise = 0;
                that.droneFaye.publish("/drone/drone", {
                    action: "stop"
                });
                that.dxbool = false;

            }
            else if(dx>50) {
                that.speed.up = that.speed.up >=that.maxSpeed ? that.maxSpeed
                 : that.speed.up + 0.08 / (1-that.speed.up);
            
                that.droneFaye.publish("/drone/move", {
                    action: "up",
                    speed: that.speed.up
                });
                that.dxbool = true;

            }
            else if(dx<-50){
                that.speed.down = that.speed.down >=that.maxSpeed ? that.maxSpeed
                 : that.speed.down + 0.08 / (1-that.speed.down);
            
                that.droneFaye.publish("/drone/move", {
                    action: "down",
                    speed: that.speed.down
                });
                that.dxbool = true;
            }
            if(dy<50 && dy>-50 && that.dybool) {
                that.speed.up = 0;
                that.speed.down = 0;
                that.droneFaye.publish("/drone/drone", {
                    action: "stop"
                });
                that.dybool = false;
            }
            else if(dy>50) {
                that.speed.clockwise = that.speed.clockwise >=that.maxSpeed ? that.maxSpeed
                 : that.speed.clockwise + 0.08 / (1-that.speed.clockwise);
            
                that.droneFaye.publish("/drone/move", {
                    action: "clockwise",
                    speed: that.speed.clockwise
                });
                that.dybool = true;
            }
            else if(dy<-50){
               that.speed.counterClockwise = that.speed.counterClockwise >=that.maxSpeed ? that.maxSpeed
                 : that.speed.counterClockwise + 0.08 / (1-that.speed.counterClockwise);
            
                that.droneFaye.publish("/drone/move", {
                    action: "counterClockwise",
                    speed: that.speed.counterClockwise
                });
                that.dybool = true;
            }    

        }, 1/30 * 1000);
	};

    MobileJoystickView.prototype.render = function(){
        $('#mobileButtons').append('<div class="input-append btn-group">\
            <button id="start" class="btn btn-success disabled" data-action="drone" data-param="takeoff"><i class="icon-play icon-white"></i> takeoff</button> \
            <button id="land" class="btn btn-warning disabled" data-action="drone" data-param="land"><i class="icon-stop icon-white"></i> land</button> \
            <button id="recover" class="btn btn-danger disabled" data-action="drone" data-param="disableEmergency"><i class="icon-wrench icon-white"></i> recover</button>\
            <button class="btn btn-info disabled" id="release"><i class="icon-eject icon-white"></i> release</button> \
            <button class="btn btn-primary" id="token"><i class="icon-white icon-plane"></i> Fly the Drone</button> \
        </div>');
    };
	return MobileJoystickView;
});