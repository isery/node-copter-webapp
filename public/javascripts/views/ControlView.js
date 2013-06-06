define(['jQuery', 'bootstrap','logger'], function($, _bootstrap, logger) {
	var ControlView = function (model, droneFaye, $element,guid) {
		this.model = model;
		this.droneFaye = droneFaye;
		this.element = $element;
		var that = this;
		var activeRecording = false;
		this.render();
        this.guid = guid;

        this.droneFaye.subscribe("/drone/newvideo", function(path) {
            $('#video').text = path;
            $('#record').removeClass('btn-danger'); 
        });

        $('#token').on('click', function(ev) {
            if(!$(this).hasClass('disabled')) {
                console.log('clicked '+that.guid);
                that.droneFaye.publish("/drone/getToken", {
                    guid: that.guid
                });
            }        
        });

        $('.btn').on('click', function(ev) {
            that.droneFaye.publish("/drone/" + $(this).attr("data-action"), {
                action: $(this).attr("data-param"),
                speed: 0.3,
                duration: 1000 * parseInt($("#duration").val())
            });  
        });

        $('#record').on('click', function(ev) {
            if(!$(this).hasClass('disabled')) {
                activeRecording = !activeRecording;
                if(activeRecording) {
                    $(this).addClass('btn-danger');
                }
                that.droneFaye.publish("/drone/recording", {
                }); 
            } 
        });

        $('#picture').on('click', function(ev) {
            if(!$(this).hasClass('disabled')) {
                var src = that.model.getCurrentImg();
                $('#link').text = src;
                that.droneFaye.publish("/drone/saveImage",{src: src});
            }
        });

        $('#release').on('click', function(ev) {
            if(!$(this).hasClass('disabled')) {
                that.droneFaye.publish("/drone/release",{});
            }
        });

		$("*[data-action]").on("mousedown", function(ev) {
            
		  	that.droneFaye.publish("/drone/" + $(this).attr("data-action"), {
		    	action: $(this).attr("data-param"),
		    	speed: 0.3,
		    	duration: 1000 * parseInt($("#duration").val())
		  	});
		});
		$("*[data-action]").on("mouseup", function(ev) {
            $('.brand').text('test');
			that.droneFaye.publish("/drone/move", {
		    	action: $(this).attr("data-param"),
		    	speed: $(this).attr("data-action") === "move" ? 0 : void 0
		  	});
		});
	};

	ControlView.prototype.render = function(){
        this.element.append('\
			<div class="input-append btn-group">\
            <button class="btn btn-success disabled" data-action="drone" data-param="takeoff"><i class="icon-play icon-white"></i> takeoff</button> \
            <button class="btn btn-warning disabled" data-action="drone" data-param="land"><i class="icon-stop icon-white"></i> land</button> \
            <button class="btn btn-danger disabled" data-action="drone" data-param="disableEmergency"><i class="icon-wrench icon-white"></i> recover</button> \
            <button class="btn btn-info disabled" id="release"><i class="icon-eject icon-white"></i> release</button> \
            <button class="btn btn-primary" id="token"><i class="icon-white icon-plane"></i> Fly the Drone</button> \
        	</div>\
            <div class="input-append btn-group actions">\
                <button class="btn dropdown-toggle disabled" data-toggle="dropdown">Animations <span class="caret"></span></button>\
                <ul class="dropdown-menu">\
                    <li data-action="animate" data-param="phiM30Deg"><a href="#">phiM30Deg</a></li>\
                    <li data-action="animate" data-param="phi30Deg"><a href="#">phi30Deg</a></li>\
                    <li data-action="animate" data-param="thetaM30Deg"><a href="#">thetaM30Deg</a></li>\
                    <li data-action="animate" data-param="theta30Deg"><a href="#">theta30Deg</a></li>\
                    <li data-action="animate" data-param="theta20degYaw200deg"><a href="#">theta20degYaw200deg</a></li>\
                    <li data-action="animate" data-param="theta20degYawM200deg"><a href="#">theta20degYawM200deg</a></li>\
                    <li data-action="animate" data-param="turnaround"><a href="#">turnaround</a></li>\
                    <li data-action="animate" data-param="turnaroundGodown"><a href="#">turnaroundGodown</a></li>\
                    <li data-action="animate" data-param="yawShake"><a href="#">yawShake</a></li>\
                    <li data-action="animate" data-param="yawDance"><a href="#">yawDance</a></li>\
                    <li data-action="animate" data-param="phiDance"><a href="#">phiDance</a></li>\
                    <li data-action="animate" data-param="thetaDance"><a href="#">thetaDance</a></li>\
                    <li data-action="animate" data-param="vzDance"><a href="#">vzDance</a></li>\
                    <li data-action="animate" data-param="wave"><a href="#">wave</a></li>\
                    <li data-action="animate" data-param="phiThetaMixed"><a href="#">phiThetaMixed</a></li>\
                    <li data-action="animate" data-param="doublePhiThetaMixed"><a href="#">doublePhiThetaMixed</a></li>\
                    <li data-action="animate" data-param="flipAhead"><a href="#">flipAhead</a></li>\
                    <li data-action="animate" data-param="flipBehind"><a href="#">flipBehind</a></li>\
                    <li data-action="animate" data-param="flipLeft"><a href="#">flipLeft</a></li>\
                    <li data-action="animate" data-param="flipRight"><a href="#">flipRight</a></li>\
                </ul>\
                <input class="span1" id="duration" size="3" type="number" value="2" rel="tooltip" data-placement="bottom" title="Trigger animations. You can change the duration of an animation. It defaults to 2 seconds."> <span class="add-on"><i class="icon-time"></i></span>\
                <button class="btn disabled" id="record"><i class="icon-facetime-video"></i> Record</button> \
                <button class="btn disabled" id="picture"><i class="icon-camera"></i> Snap</button> \
                <span id="link"></span> \
                <span id="video"></span> \
            </div> \
        ');
    };

	return ControlView;
});
