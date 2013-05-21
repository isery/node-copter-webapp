define(['jQuery', 'logger'], function($, logger) {
    var ControlGyroView = function(model, controller,droneFaye, $element) {
        this.model = model;
        this.controller = controller;
        this.droneFaye = droneFaye;
        this.maxSpeed = 0.7;
        this.speed= {
            front: 0,
            back: 0,
            left: 0,
            right: 0
        };
        this.betaBool = true;
        this.gammaBool = true;
        var that = this;

        window.ondeviceorientation = function(event) {
            console.log("width" + document.width);
            console.log("height"+ document.height);
            if(Math.round(event.beta)>20) {
                console.log("right");
                that.speed.right = that.speed.right >=that.maxSpeed ? that.maxSpeed : that.speed.right + 0.04 / (1-that.speed.right);
                console.log(that.speed.right);
                that.droneFaye.publish("/drone/move", {
                    action: "right",
                    speed: that.speed.right
                });
                that.betaBool=true;
            }
            else if(Math.round(event.beta)<-20) {
                console.log("left");
                that.speed.left = that.speed.left >=that.maxSpeed ? that.maxSpeed : that.speed.left + 0.04 / (1-that.speed.left);
                console.log(that.speed.left);
                that.droneFaye.publish("/drone/move", {
                    action: "left",
                    speed: that.speed.left
                });
                that.betaBool=true;
            }
            else if(Math.round(event.beta)>-20 && Math.round(event.beta)<20 && that.betaBool) {
                console.log('middle');
                that.speed.front = 0;
                that.speed.back = 0;
                that.droneFaye.publish("/drone/drone", {
                    action: "stop"
                });
                that.betaBool = false;
            }
            
            if(Math.round(event.gamma)>20) {
                console.log("front");
                that.speed.front = that.speed.front >=that.maxSpeed ? that.maxSpeed : that.speed.front + 0.04 / (1-that.speed.front);
                console.log(that.speed.front);
                that.droneFaye.publish("/drone/move", {
                    action: "front",
                    speed: that.speed.front
                });
                that.gammaBool=true;
            }
            else if(Math.round(event.gamma)<-20) {
                console.log("back");
                that.speed.back = that.speed.back >=that.maxSpeed ? that.maxSpeed : that.speed.back + 0.04 / (1-that.speed.back);
                console.log(that.speed.back);
                that.droneFaye.publish("/drone/move", {
                    action: "back",
                    speed: that.speed.back
                });
                that.gammaBool=true;
            }
            else if(Math.round(event.gamma)>-20 && Math.round(event.gamma)<20 && that.gammaBool) {
                console.log('middle');
                that.speed.front = 0;
                that.speed.back = 0;
                that.droneFaye.publish("/drone/drone", {
                    action: "stop"
                });
                that.gammaBool=false;
            }
        }
    };

    ControlGyroView.prototype.render = function (e) {
    };


    return ControlGyroView;
});
