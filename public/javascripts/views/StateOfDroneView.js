define(['jQuery', 'logger'], function($, logger) {
    var StateOfDroneView = function (droneFaye, model, $element, $element2) {
        this.model = model;
        this.element=$element;
        this.element2=$element2;
        that = this;
        this.render();
        droneFaye.subscribe("/drone/navdata", function(data) {
            ["batteryPercentage", "clockwiseDegrees", "altitudeMeters", "frontBackDegrees", "leftRightDegrees", "xVelocity", "yVelocity", "zVelocity"].forEach(function(type) {
                $("#" + type).html(Math.round(data.demo[type], 4));
            });
            that.showBatteryStatus(data.demo.batteryPercentage);
        });

    };

    StateOfDroneView.prototype.showBatteryStatus = function(batteryPercentage) {
        $("#batterybar").width("" + batteryPercentage + "%");
        if (batteryPercentage < 30) {
            $("#batteryProgress").removeClass("progress-success").addClass("progress-warning");
        }
        if (batteryPercentage < 15) {
            $("#batteryProgress").removeClass("progress-warning").addClass("progress-danger");
        }
        return $("#batteryProgress").attr({
          "data-original-title": "Battery status: " + batteryPercentage + "%"
        });
  };

    StateOfDroneView.prototype.render = function () {
        if(this.element2.attr('id')==="batteryProgress"){
            this.element.append('\
                <table class="table table-striped table-bordered">\
                    <tr>\
                        <th>State</th>\
                        <th>Value</th>\
                    </tr>\
                    <tr>\
                        <td>Battery</td>\
                        <td id="batteryPercentage">(Drone not connected)</td>\
                    </tr>\
                    <tr>\
                        <td>Direction</td>\
                        <td id="clockwiseDegrees">°</td>\
                    </tr>\
                    <tr>\
                        <td>Front / Back</td>\
                        <td id="frontBackDegrees">°</td>\
                    </tr>\
                    <tr>\
                        <td>Left / Right</td>\
                        <td id="leftRightDegrees">°</td>\
                    </tr>\
                    <tr>\
                        <td>Altitude (metres)</td>\
                        <td id="altitudeMeters">m</td>\
                    </tr>\
                    <tr>\
                        <td>Velocity (x | y | z)</td>\
                        <td><span id="xVelocity">x</span> | <span id="yVelocity">y</span> | <span id="zVelocity">z</span></td>\
                    </tr>\
                </table>\
                ');
            this.element2.append('<div class="progress progress-success progress-striped" title="Battery status" rel="tooltip" data-placement="right">\
                <div class="bar" id="batterybar" style="width: 100%;"></div>\
            </div>');
        }
        else{
            this.element2.append('<div class="progress progress-success progress-striped" title="Battery status" rel="tooltip" data-placement="right">\
                <div class="bar" id="batterybar" style="width: 100%;"></div>\
            </div>');            
        }
    };
    return StateOfDroneView;
});
