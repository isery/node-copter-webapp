 define(['jQuery', 'logger', 'keydrown'], function($, logger, kd) {
	var ControlKeyView = function (model, droneFaye, $element) {
		this.model = model;
		this.droneFaye = droneFaye;
		this.maxSpeed = [];
		this.maxSpeed[1] = 0.3;
		this.maxSpeed[2] = 0.6;
		this.maxSpeed[3] = 1;
		this.currentMaxSpeed = 1;
		this.speed= {
			clockwise: 0,
			counterClockwise: 0,
			up: 0,
			down: 0,
			front: 0,
			back: 0,
			left: 0,
			right: 0
		};

		var that = this;

		window.addEventListener("keydown", function(e) {
		    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		        e.preventDefault();
		    }
		}, false);

		kd.run(function () {
  			kd.tick();
		});

		document.addEventListener('keyup', function (evt) {
		  if (evt.keyCode === 49) {
		    that.currentMaxSpeed = 1; 
		  }
		  if (evt.keyCode === 50) {
		  	that.currentMaxSpeed = 2;
		  }
		  if (evt.keyCode === 51) {
		  	that.currentMaxSpeed = 3;
		  }
		});

		this.normalControl(that); //** for normal fly

	};

	ControlKeyView.prototype.keydown = function(action) {
		this.speed[action] = this.speed[action] >=this.maxSpeed[this.currentMaxSpeed] ? this.maxSpeed[this.currentMaxSpeed]
				 : this.speed[action] + 0.08 / (1-this.speed[action]);
		this.droneFaye.publish("/drone/move", {
			action: action,
			speed: this.speed[action]
		});
	}
	ControlKeyView.prototype.keyup = function(action) {
		this.speed[action] = 0;
		this.droneFaye.publish("/drone/drone", {
			action: "stop"
		});
	}

	ControlKeyView.prototype.normalControl = function(that){

		kd.RIGHT.down(function () {
			that.keydown('clockwise');	  		
		});

		kd.RIGHT.up(function () {
			that.keyup('clockwise');
		});

		kd.LEFT.down(function () {
			that.keydown('counterClockwise');
		});

		kd.LEFT.up(function () {
			that.keyup('counterClockwise');
		});

		kd.UP.down(function () {
			that.keydown('up');
		});

		kd.UP.up(function () {
			that.keyup('up');
		});

		kd.DOWN.down(function () {
			that.keydown('down');
		});

		kd.DOWN.up(function () {
			that.keyup('down');
		});

		kd.W.down(function () {
			that.keydown('front');
		});

		kd.W.up(function () {
			that.keyup('front');
		});

		kd.A.down(function () {
			that.keydown('left');
		});

		kd.A.up(function () {
			that.keyup('left');
		});

		kd.D.down(function () {
			that.keydown('right');
		});

		kd.D.up(function () {
			that.keyup('right');
		});

		kd.S.down(function () {
			that.keydown('back');
		});

		kd.S.up(function () {
			that.keyup('back');
		});


		kd.F.down(function(){
			that.droneFaye.publish("/drone/animate", {
				action: "flipLeft",
				duration: 15
			});
		});

		kd.F.up(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
		});

		kd.SPACE.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "takeoff"
			});
		});

		kd.ESC.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "land"
			});
		});
	};
	return ControlKeyView;
});