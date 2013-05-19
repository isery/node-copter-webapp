 define(['jQuery', 'logger', 'keydrown'], function($, logger, kd) {
	var ControlKeyView = function (model, droneFaye, $element) {
		this.model = model;
		this.droneFaye = droneFaye;
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

		this.delay= {
			clockwise: 0,
			counterClockwise: 0,
			up: 0,
			down: 0,
			front: 0,
			back: 0,
			left: 0,
			right: 0
		};
		this.MAXDELAY=50;

		this.invertControlling = false;

		$(".container-fluid").append('\
				<div id="keyboard"></div>\
			');

		var that = this;
		this.render();

		window.addEventListener("keydown", function(e) {
		    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
		        e.preventDefault();
		    }
		}, false);

		kd.run(function () {
  			kd.tick();
		});

		this.normalControl(that);
		//this.switchControls(that);
		//this.delayedControl(that);
	};


	ControlKeyView.prototype.switchControls = function(that){
		setInterval(function(){
			if(!that.invertControlling){
				that.invertControlling=true;
				that.invertControl(that);
			}
			else{
				that.invertControlling=false;
				that.normalControl(that);
			}
		}, 5000);
	};

	ControlKeyView.prototype.normalControl = function(that){
		kd.RIGHT.down(function () {
			that.speed.clockwise = that.speed.clockwise >=1 ? 1
				 : that.speed.clockwise + 0.08 / (1-that.speed.clockwise);
			
			that.droneFaye.publish("/drone/move", {
				action: "clockwise",
				speed: that.speed.clockwise
			});
			$("#right").addClass('keydown');	  		

		});

		kd.RIGHT.up(function () {
			that.speed.clockwise = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#right").removeClass('keydown');	  		
		});

		kd.LEFT.down(function () {
			that.speed.counterClockwise = that.speed.counterClockwise >=1 ? 1
				 : that.speed.counterClockwise + 0.08 / (1-that.speed.counterClockwise);
			
			that.droneFaye.publish("/drone/move", {
				action: "counterClockwise",
				speed: that.speed.counterClockwise
			});
			$("#left").addClass('keydown');	  			  		
		});

		kd.LEFT.up(function () {
			that.speed.counterClockwise = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#left").removeClass('keydown');	  		
		});

		kd.UP.down(function () {
			that.speed.up = that.speed.up >=1 ? 1
				 : that.speed.up + 0.08 / (1-that.speed.up);
			
			that.droneFaye.publish("/drone/move", {
				action: "up",
				speed: that.speed.up
			});
			$("#up").addClass('keydown');	  		
		});

		kd.UP.up(function () {
			that.speed.up = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#up").removeClass('keydown');	  		
		});

		kd.DOWN.down(function () {
			that.speed.down = that.speed.down >=1 ? 1
				 : that.speed.down + 0.08 / (1-that.speed.down);
			
			that.droneFaye.publish("/drone/move", {
				action: "down",
				speed: that.speed.down
			});
			$("#down").addClass('keydown');	  		
		});

		kd.DOWN.up(function () {
			that.speed.down = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#down").removeClass('keydown');	  		
		});

		kd.W.down(function () {
			that.speed.front = that.speed.front >=1 ? 1
				 : that.speed.front + 0.08 / (1-that.speed.front);
			
			that.droneFaye.publish("/drone/move", {
				action: "front",
				speed: that.speed.front
			});
			$(".c87").addClass('keydown');	  		
		});

		kd.W.up(function () {
			that.speed.front = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c87").removeClass('keydown');	  		
		});

		kd.A.down(function () {
			that.speed.left = that.speed.left >=1 ? 1
				 : that.speed.left + 0.08 / (1-that.speed.left);
			
			that.droneFaye.publish("/drone/move", {
				action: "left",
				speed: that.speed.left
			});
			$(".c65").addClass('keydown');	  		
		});

		kd.A.up(function () {
			that.speed.left = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c65").removeClass('keydown');	  		
		});

		kd.D.down(function () {
			that.speed.right = that.speed.right >=1 ? 1
				 : that.speed.right + 0.08 / (1-that.speed.right);
			
			that.droneFaye.publish("/drone/move", {
				action: "right",
				speed: that.speed.right
			});
			$(".c68").addClass('keydown');	  		
		});

		kd.D.up(function () {
			that.speed.right = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c68").removeClass('keydown');	  		
		});

		kd.S.down(function () {
			that.speed.back = that.speed.back >=1 ? 1
				 : that.speed.back + 0.08 / (1-that.speed.back);
			
			that.droneFaye.publish("/drone/move", {
				action: "back",
				speed: that.speed.back
			});
			$(".c83").addClass('keydown');	  		
		});

		kd.S.up(function () {
			that.speed.back = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c83").removeClass('keydown');	  		
		});


		kd.F.down(function(){
			that.droneFaye.publish("/drone/animate", {
				action: "flipLeft",
				duration: 15
			});
			$(".c70").addClass('keydown');
		});

		kd.F.up(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c70").removeClass('keydown');	 
		});

		kd.SPACE.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "takeoff"
			});
			$(".c32").addClass('keydown');
		});

		kd.SPACE.up(function(){
			$(".c32").removeClass('keydown');
		});

		kd.ESC.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "land"
			});
			$(".c27").addClass('keydown');
		});

		kd.ESC.up(function(){
			$(".c27").removeClass('keydown');
		});
	};

	ControlKeyView.prototype.invertControl = function(that){
		kd.RIGHT.down(function () {
			that.speed.counterClockwise = that.speed.counterClockwise >=1 ? 1
				 : that.speed.counterClockwise + 0.08 / (1-that.speed.counterClockwise);
			
			that.droneFaye.publish("/drone/move", {
				action: "counterClockwise",
				speed: that.speed.counterClockwise
			});
			$("#right").addClass('keydown');	  		

		});

		kd.RIGHT.up(function () {
			that.speed.counterClockwise = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#right").removeClass('keydown');	  		
		});

		kd.LEFT.down(function () {
			that.speed.clockwise = that.speed.clockwise >=1 ? 1
				 : that.speed.clockwise + 0.08 / (1-that.speed.clockwise);
			
			that.droneFaye.publish("/drone/move", {
				action: "clockwise",
				speed: that.speed.clockwise
			});
			$("#left").addClass('keydown');	  			  		
		});

		kd.LEFT.up(function () {
			that.speed.clockwise = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#left").removeClass('keydown');	  		
		});

		kd.UP.down(function () {
			that.speed.up = that.speed.up >=1 ? 1
				 : that.speed.up + 0.08 / (1-that.speed.up);
			
			that.droneFaye.publish("/drone/move", {
				action: "up",
				speed: that.speed.up
			});
			$("#up").addClass('keydown');	  		
		});

		kd.UP.up(function () {
			that.speed.up = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#up").removeClass('keydown');	  		
		});

		kd.DOWN.down(function () {
			that.speed.down = that.speed.down >=1 ? 1
				 : that.speed.down + 0.08 / (1-that.speed.down);
			
			that.droneFaye.publish("/drone/move", {
				action: "down",
				speed: that.speed.down
			});
			$("#down").addClass('keydown');	  		
		});

		kd.DOWN.up(function () {
			that.speed.down = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#down").removeClass('keydown');	  		
		});

		kd.W.down(function () {
			that.speed.back = that.speed.back >=1 ? 1
				 : that.speed.back + 0.08 / (1-that.speed.back);
			
			that.droneFaye.publish("/drone/move", {
				action: "back",
				speed: that.speed.back
			});
			$(".c87").addClass('keydown');	  		
		});

		kd.W.up(function () {
			that.speed.back = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c87").removeClass('keydown');	  		
		});

		kd.A.down(function () {
			that.speed.right = that.speed.right >=1 ? 1
				 : that.speed.right + 0.08 / (1-that.speed.right);
			
			that.droneFaye.publish("/drone/move", {
				action: "right",
				speed: that.speed.right
			});
			$(".c65").addClass('keydown');	  		
		});

		kd.A.up(function () {
			that.speed.right = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c65").removeClass('keydown');	  		
		});

		kd.D.down(function () {
			that.speed.left = that.speed.left >=1 ? 1
				 : that.speed.left + 0.08 / (1-that.speed.left);
			
			that.droneFaye.publish("/drone/move", {
				action: "left",
				speed: that.speed.left
			});
			
			$(".c68").addClass('keydown');	  		
		});

		kd.D.up(function () {
			that.speed.left = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c68").removeClass('keydown');	  		
		});

		kd.S.down(function () {
			that.speed.front = that.speed.front >=1 ? 1
				 : that.speed.front + 0.08 / (1-that.speed.front);
			
			that.droneFaye.publish("/drone/move", {
				action: "front",
				speed: that.speed.front
			});
			$(".c83").addClass('keydown');	  		
		});

		kd.S.up(function () {
			that.speed.front = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c83").removeClass('keydown');	  		
		});


		kd.F.down(function(){
			that.droneFaye.publish("/drone/animate", {
				action: "flipLeft",
				duration: 15
			});
			$(".c70").addClass('keydown');
		});

		kd.F.up(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c70").removeClass('keydown');	 
		});

		kd.SPACE.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "takeoff"
			});
			$(".c32").addClass('keydown');
		});

		kd.SPACE.up(function(){
			$(".c32").removeClass('keydown');
		});

		kd.ESC.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "land"
			});
			$(".c27").addClass('keydown');
		});

		kd.ESC.up(function(){
			$(".c27").removeClass('keydown');
		});
	};

	ControlKeyView.prototype.delayedControl = function(that){

		kd.RIGHT.down(function () {
			that.delay.clockwise++;
			if(that.delay.clockwise > that.MAXDELAY){
				that.speed.clockwise = that.speed.clockwise >=1 ? 1
					 : that.speed.clockwise + 0.08 / (1-that.speed.clockwise);
				
				that.droneFaye.publish("/drone/move", {
					action: "clockwise",
					speed: that.speed.clockwise
				});
				$("#right").addClass('keydown');	  		
			}
		});

		kd.RIGHT.up(function () {
			that.speed.clockwise = 0;
			that.delay.clockwise = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#right").removeClass('keydown');	  		
		});

		kd.LEFT.down(function () {
			that.delay.counterClockwise++;
			if(that.delay.counterClockwise > that.MAXDELAY){
				that.speed.counterClockwise = that.speed.counterClockwise >=1 ? 1
					 : that.speed.counterClockwise + 0.08 / (1-that.speed.counterClockwise);
				
				that.droneFaye.publish("/drone/move", {
					action: "counterClockwise",
					speed: that.speed.counterClockwise
				});
				$("#left").addClass('keydown');	  			  		
			}
		});

		kd.LEFT.up(function () {
			that.speed.counterClockwise = 0;
			that.delay.counterClockwise = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#left").removeClass('keydown');	  		
		});

		kd.UP.down(function () {
			that.delay.up++;
			if(that.delay.up > that.MAXDELAY){
				that.speed.up = that.speed.up >=1 ? 1
					 : that.speed.up + 0.08 / (1-that.speed.up);
				
				that.droneFaye.publish("/drone/move", {
					action: "up",
					speed: that.speed.up
				});
				$("#up").addClass('keydown');	  		
			}
		});

		kd.UP.up(function () {
			that.speed.up = 0;
			that.delay.up = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#up").removeClass('keydown');	  		
		});

		kd.DOWN.down(function () {
			that.delay.down++;
			if(that.delay.down > that.MAXDELAY){
				that.speed.down = that.speed.down >=1 ? 1
					 : that.speed.down + 0.08 / (1-that.speed.down);
				
				that.droneFaye.publish("/drone/move", {
					action: "down",
					speed: that.speed.down
				});
				$("#down").addClass('keydown');
			}	  		
		});

		kd.DOWN.up(function () {
			that.speed.down = 0;
			that.delay.down = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$("#down").removeClass('keydown');	  		
		});

		kd.W.down(function () {
			that.delay.front++;
			if(that.delay.front > that.MAXDELAY){
				that.speed.front = that.speed.front >=1 ? 1
					 : that.speed.front + 0.08 / (1-that.speed.front);
				
				that.droneFaye.publish("/drone/move", {
					action: "front",
					speed: that.speed.front
				});
				$(".c87").addClass('keydown');
			}  		
		});

		kd.W.up(function () {
			that.speed.front = 0;
			that.delay.front = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c87").removeClass('keydown');	  		
		});

		kd.A.down(function () {
			that.delay.left++;
			if(that.delay.left > that.MAXDELAY){
				that.speed.left = that.speed.left >=1 ? 1
					 : that.speed.left + 0.08 / (1-that.speed.left);
				
				that.droneFaye.publish("/drone/move", {
					action: "left",
					speed: that.speed.left
				});
				$(".c65").addClass('keydown');	  		
			}
		});

		kd.A.up(function () {
			that.speed.left = 0;
			that.delay.left = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c65").removeClass('keydown');	  		
		});

		kd.D.down(function () {
			that.delay.right++;
			if(that.delay.right > that.MAXDELAY){
				that.speed.right = that.speed.right >=1 ? 1
					 : that.speed.right + 0.08 / (1-that.speed.right);
				
				that.droneFaye.publish("/drone/move", {
					action: "right",
					speed: that.speed.right
				});
				$(".c68").addClass('keydown');
			}  		
		});

		kd.D.up(function () {
			that.speed.right = 0;
			that.delay.right = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c68").removeClass('keydown');	  		
		});

		kd.S.down(function () {
			that.delay.back++;
			if(that.delay.back > that.MAXDELAY){
				that.speed.back = that.speed.back >=1 ? 1
					 : that.speed.back + 0.08 / (1-that.speed.back);
				
				that.droneFaye.publish("/drone/move", {
					action: "back",
					speed: that.speed.back
				});
				$(".c83").addClass('keydown');	  		
			}
		});

		kd.S.up(function () {
			that.speed.back = 0;
			that.delay.back = 0;
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c83").removeClass('keydown');	  		
		});


		kd.F.down(function(){
			that.droneFaye.publish("/drone/animate", {
				action: "flipLeft",
				duration: 15
			});
			$(".c70").addClass('keydown');
		});

		kd.F.up(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "stop"
			});
			$(".c70").removeClass('keydown');	 
		});

		kd.SPACE.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "takeoff"
			});
			$(".c32").addClass('keydown');
		});

		kd.SPACE.up(function(){
			$(".c32").removeClass('keydown');
		});

		kd.ESC.down(function(){
			that.droneFaye.publish("/drone/drone", {
				action: "land"
			});
			$(".c27").addClass('keydown');
		});

		kd.ESC.up(function(){
			$(".c27").removeClass('keydown');
		});
	};
	ControlKeyView.prototype.render = function (e) {
	$("#keyboard").append('\
	    	<ul class="cf">\
        	<li><a  class="key c27 fn"><span id="esc">esc</span></a></li>\
        	<li><a  class="key c112 fn"><span>F1</span></a></li>\
        	<li><a  class="key c113 fn"><span>F2</span></a></li>\
        	<li><a  class="key c114 fn"><span>F3</span></a></li>\
        	<li><a  class="key c115 fn"><span>F4</span></a></li>\
        	<li><a  class="key c116 fn"><span>F5</span></a></li>\
        	<li><a  class="key c117 fn"><span>F6</span></a></li>\
        	<li><a  class="key c118 fn"><span>F7</span></a></li>\
        	<li><a  class="key c119 fn"><span>F8</span></a></li>\
        	<li><a  class="key c120 fn"><span>F9</span></a></li>\
        	<li><a  class="key c121 fn"><span>F10</span></a></li>\
        	<li><a  class="key c122 fn"><span>F11</span></a></li>\
        	<li><a  class="key c123 fn"><span>F12</span></a></li>\
        	<li><a  class="key fn"><span>Eject</span></a></li>\
        </ul>\
    	<ul class="cf" id="numbers">\
	    	<li><a  class="key c192"><b>~</b><span>^</span></a></li>\
	    	<li><a  class="key c49"><b>!</b><span>1</span></a></li>\
	    	<li><a  class="key c50"><b>"</b><span>2</span></a></li>\
	    	<li><a  class="key c51"><b>§</b><span>3</span></a></li>\
	    	<li><a  class="key c52"><b>$</b><span>4</span></a></li>\
	    	<li><a  class="key c53"><b>%</b><span>5</span></a></li>\
	    	<li><a  class="key c54"><b>&amp;</b><span>6</span></a></li>\
	    	<li><a  class="key c55"><b>/</b><span>7</span></a></li>\
	    	<li><a  class="key c56"><b>(</b><span>8</span></a></li>\
	    	<li><a  class="key c57"><b>)</b><span>9</span></a></li>\
	    	<li><a  class="key c48"><b>=</b><span>0</span></a></li>\
	    	<li><a  class="key c189 alt"><b>?</b><span>-</span></a></li>\
	    	<li><a  class="key c187"><b>+</b><span>´</span></a></li>\
	    	<li><a  class="key c46" id="delete"><span>Delete</span></a></li>\
        </ul>\
    	<ul class="cf" id="qwerty">\
	    	<li><a  class="key c9" id="tab"><span>tab</span></a></li>\
	    	<li><a  class="key c81"><span>q</span></a></li>\
	    	<li><a  class="key c87"><span>w</span></a></li>\
	    	<li><a  class="key c69"><span>e</span></a></li>\
	    	<li><a  class="key c82"><span>r</span></a></li>\
	    	<li><a  class="key c84"><span>t</span></a></li>\
	    	<li><a  class="key c89"><span>z</span></a></li>\
	    	<li><a  class="key c85"><span>u</span></a></li>\
	    	<li><a  class="key c73"><span>i</span></a></li>\
	    	<li><a  class="key c79"><span>o</span></a></li>\
	    	<li><a  class="key c80"><span>p</span></a></li>\
	    	<li><a  class="key c219 alt"><b>{</b><span>[</span></a></li>\
	    	<li><a  class="key c221 alt"><b>}</b><span>]</span></a></li>\
	    	<li><a  class="key c220 alt"><b>|</b><span>-</span></a></li>\
        </ul>\
        <ul class="cf" id="asdfg">\
	    	<li><a  class="key c20 alt" id="caps"><b></b><span>caps lock</span></a></li>\
	    	<li><a  class="key c65"><span>a</span></a></li>\
	    	<li><a  class="key c83"><span>s</span></a></li>\
	    	<li><a  class="key c68"><span>d</span></a></li>\
	    	<li><a  class="key c70"><span>f</span></a></li>\
	    	<li><a  class="key c71"><span>g</span></a></li>\
	    	<li><a  class="key c72"><span>h</span></a></li>\
	    	<li><a  class="key c74"><span>j</span></a></li>\
	    	<li><a  class="key c75"><span>k</span></a></li>\
	    	<li><a  class="key c76"><span>l</span></a></li>\
	    	<li><a  class="key c186 alt"><b>:</b><span>;</span></a></li>\
	    	<li><a  class="key c222 alt"><b>"</b><span>#</span></a></li>\
	    	<li><a  class="key c13 alt" id="enter"><span>return</span></a></li>\
        </ul>\
        <ul class="cf" id="zxcvb">\
	    	<li><a  class="key c16 shiftleft"><span>Shift</span></a></li>\
	    	<li><a  class="key c90"><span>y</span></a></li>\
	    	<li><a  class="key c88"><span>x</span></a></li>\
	    	<li><a  class="key c67"><span>c</span></a></li>\
	    	<li><a  class="key c86"><span>v</span></a></li>\
	    	<li><a  class="key c66"><span>b</span></a></li>\
	    	<li><a  class="key c78"><span>n</span></a></li>\
	    	<li><a  class="key c77"><span>m</span></a></li>\
	    	<li><a  class="key c188 alt"><b>&lt;</b><span>,</span></a></li>\
	    	<li><a  class="key c190 alt"><b>&gt;</b><span>.</span></a></li>\
	    	<li><a  class="key c191 alt"><b>?</b><span>/</span></a></li>\
	    	<li><a  class="key c16 shiftright"><span>Shift</span></a></li>\
        </ul>\
		<ul class="cf" id="bottomrow">\
	    	<li><a  class="key" id="fn"><span>fn</span></a></li>\
	    	<li><a  class="key c17" id="control"><span>control</span></a></li>\
	    	<li><a  class="key option" id="optionleft"><span>option</span></a></li>\
	    	<li><a  class="key command" id="commandleft"><span>command</span></a></li>\
	    	<li><a  class="key c32" id="spacebar"></a></li>\
	    	<li><a  class="key command" id="commandright"><span>command</span></a></li>\
	    	<li><a  class="key option" id="optionright"><span>option</span></a></li>\
            <ol class="cf">\
            	<li><a  class="key c37" id="left"><span><img class="scale left" src="../../images/left.png" /></span></a></li>\
                <li>\
                	<a  class="key c38" id="up"><span><img class="scale up" src="../../images/up.png" /></span></a>\
                	<a  class="key c40" id="down"><span><img class="scale down" src="../../images/down.png" /></span></a>\
                </li>\
            	<li><a class="key c39" id="right"><span><img class="scale right" src="../../images/right.png" /></span></a></li>\
            </ol>\
        </ul>\
    ');
	ControlKeyView.prototype.removeKeyboard = function(){
		$("#keyboard").empty();
	};};
	return ControlKeyView;
});