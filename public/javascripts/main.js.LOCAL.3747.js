require.config({
	baseUrl: "javascripts",
	waitSeconds: 15,
	paths: {
		'jQuery': '../vendor/jquery-1.9.1.min',
		'bootstrap': '../vendor/bootstrap.min',
		'keydrown': '../vendor/keydrown.min',
		'underscore': '../vendor/underscore-1.3.3',
		'faye': '../vendor/faye-client',
		'joystick': '../vendor/virtualjoystick',
		'bacon': '../vendor/bacon.min'
	},
	shim: {
		'jQuery': {
			exports: '$'
		},
		'bootstrap':{
			deps:['jQuery']
		},
		'keydrown': {
			exports: 'kd'
		},
		'underscore':{
			exports: '_'
		},
		'faye': {
			exports: 'Faye'
		}
	}
});
require(['jQuery', 'underscore', 'keydrown','faye', 'joystick', 'bacon','model', 'controller',
	'views/ControlKeyView', 'views/ControlGyroView', 'views/MobileStreamView','views/StreamView', 'views/MobileJoystickView','views/StateOfDroneView', 'views/ControlView'],
	function($, _, kd, faye, joystick, bacon,DroneModel, DroneController,
			 ControlKeyView, ControlGyroView, MobileStreamView, StreamView, MobileJoystickView, StateOfDroneView, ControlView) {
		var droneFaye = new faye.Client("/faye", {
			timeout: 120
		});
		var model = new DroneModel();
		var controller = new DroneController(model);

        if((bacon.isMobile() === true)) {
            var controlGyroView = new ControlGyroView(model, controller,droneFaye, $('#controlGyroView'));
            var mobileStreamView = new MobileStreamView(model, droneFaye, $("#stream"));
        	var mobileJoystickView= new MobileJoystickView(model, droneFaye, $("#stream"));
			
            if(model._isMobileBrowser){
            	window.location.hash = '#stream';
            }
            else{
            	var stateOfDroneView = new StateOfDroneView(droneFaye, model, $('#stats'), $('#mobileBatteryProgress'));
        	}
        }
        else {
            var streamView = new StreamView(droneFaye, model, $('#stream'));
            var stateOfDroneView = new StateOfDroneView(droneFaye, model, $('#stats'), $('#batteryProgress'));
            var controlView = new ControlView(model, droneFaye, $('#controlView'));
            var controlKeyView = new ControlKeyView(model, droneFaye, $('#controlKeyView'));
        }
       // 

});