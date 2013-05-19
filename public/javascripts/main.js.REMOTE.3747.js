require.config({
	baseUrl: "javascripts",
	waitSeconds: 15,
	paths: {
		'jQuery'	: '../vendor/jquery-1.9.1.min',
		'bootstrap'	: '../vendor/bootstrap.min',
		'keydrown'	: '../vendor/keydrown.min',
		'underscore': '../vendor/underscore-1.3.3',
		'faye'		: '../vendor/faye-client',
		'joystick'	: '../vendor/virtualjoystick',
		'bacon'		: '../vendor/bacon.min',
		'grid'		: '../vendor/qrcode/grid',
		'version'	: '../vendor/qrcode/version',
		'detector'	: '../vendor/qrcode/detector',
		'formatinf'	: '../vendor/qrcode/formatinf',
		'errorlevel': '../vendor/qrcode/errorlevel',
		'bitmat'	: '../vendor/qrcode/bitmat',
		'datablock'	: '../vendor/qrcode/datablock',
		'bmparser'	: '../vendor/qrcode/bmparser',
		'datamask'	: '../vendor/qrcode/datamask',
		'rsdecoder'	: '../vendor/qrcode/rsdecoder',
		'gf256poly'	: '../vendor/qrcode/gf256poly',
		'gf256'		: '../vendor/qrcode/gf256',
		'decoder'	: '../vendor/qrcode/decoder',
		'qrcode'	: '../vendor/qrcode/qrcode',
		'findpat'	: '../vendor/qrcode/findpat',
		'alignpat'	: '../vendor/qrcode/alignpat',
		'databr'	: '../vendor/qrcode/databr'
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
		},
		'qrcode': {
			exports: 'qrcode'
		},
		'findpat':{
			deps:['qrcode']
		}
	}
});



require(['jQuery', 'underscore', 'keydrown','faye', 'joystick', 'bacon',
		'grid', 'version', 'detector', 'formatinf', 'errorlevel', 'bitmat', 'datablock', 'bmparser',
		'datamask', 'rsdecoder', 'gf256poly', 'gf256', 'decoder', 'qrcode', 'findpat', 'alignpat', 'databr',
		'model', 'controller',
		'views/ControlKeyView', 'views/ControlGyroView', 'views/MobileStreamView','views/StreamView', 'views/MobileJoystickView','views/StateOfDroneView', 'views/ControlView'],
	function($, _, kd, faye, joystick, bacon, 
			grid, version, detector, formatinf, errorlevel, bitmat, datablock, bmparser,
			datamask, rsdecoder, gf256poly, gf256, decoder, qrcode, findpat, alignpat, databr,
			DroneModel, DroneController,
			ControlKeyView, ControlGyroView, MobileStreamView, StreamView, MobileJoystickView, StateOfDroneView, ControlView) {
		var droneFaye = new faye.Client("/faye", {
			timeout: 120
		});
		var stateOfDroneView;
		var model = new DroneModel();
		var controller = new DroneController(model);
        if((bacon.isMobile() === true)) {
            var controlGyroView = new ControlGyroView(model, controller,droneFaye, $('#controlGyroView'));
            var mobileStreamView = new MobileStreamView(model, droneFaye, $("#stream"));
        	var mobileJoystickView = new MobileJoystickView(model, droneFaye, $("#stream"));
            if(model._isMobileBrowser){
            	window.location.hash = '#stream';
            }
            else{
            	stateOfDroneView = new StateOfDroneView(droneFaye, model, $('#stats'), $('#mobileBatteryProgress'));
        	}
        }
        else {
            var streamView = new StreamView(droneFaye, model, $('#stream'), document.getElementById('canvasForQrCode'));
            stateOfDroneView = new StateOfDroneView(droneFaye, model, $('#stats'), $('#batteryProgress'));
            var controlView = new ControlView(model, droneFaye, $('#controlView'));
            var controlKeyView = new ControlKeyView(model, droneFaye, $('#controlKeyView'));
        }

});