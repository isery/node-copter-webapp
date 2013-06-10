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
		'onsnap'	: '../vendor/onsnap', 
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
		},
		'gf256':{
			deps:['gf256poly']
		},
		'decoder':{
			deps:['gf256']
		},
	}
});



require(['jQuery', 'underscore', 'keydrown','faye', 'joystick', 'bacon', 'onsnap',
		'grid', 'version', 'detector', 'formatinf', 'errorlevel', 'bitmat', 'datablock', 'bmparser',
		'datamask', 'rsdecoder', 'gf256poly', 'gf256', 'decoder', 'qrcode', 'findpat', 'alignpat', 'databr',
		'model', 'controller', 'views/QrDecoder',
		'views/ControlKeyView', 'views/ControlGyroView', 'views/MobileStreamView','views/StreamView', 'views/MobileJoystickView','views/StateOfDroneView', 'views/ControlView'],
	function($, _, kd, faye, joystick, bacon, onsnap,
			grid, version, detector, formatinf, errorlevel, bitmat, datablock, bmparser,
			datamask, rsdecoder, gf256poly, gf256, decoder, qrcode, findpat, alignpat, databr,
			DroneModel, DroneController, QrDecoder,
			ControlKeyView, ControlGyroView, MobileStreamView, StreamView, MobileJoystickView, StateOfDroneView, ControlView) {

        var stateOfDroneView;
        var model = new DroneModel();
        var controller = new DroneController(model);
        var controlGyroView;
        var controlView;
        var controlKeyView;
        var mobileJoystickView;
        var USER_TOKEN = '';
        var guid = Math.floor(Math.random()*100)+10;
        var qrDecoder = new QrDecoder();
        var droneFaye = new faye.Client("/faye", {
            timeout: 120
        });
        

        droneFaye.addExtension({
            outgoing: function(message, callback) {
                if(message.channel === '/drone/drone' || message.channel === '/drone/move'
                    || message.channel === '/drone/animate' || message.channel === '/drone/recording'
                    || message.channel === '/drone/qrcode' || message.channel === '/drone/saveImage'
                    || message.channel === '/drone/release') {
                    message.ext = message.ext || {};
                    message.ext.token = USER_TOKEN;
                }
                callback(message)
            }
        });

        droneFaye.subscribe("/drone/token/"+guid, function(data) {
            USER_TOKEN = data.token;
            if(USER_TOKEN === 0) {
                $('#token').removeClass('btn-primary');
                $('#token').addClass('btn-danger');
                $('#token').html('<i class="icon-white icon-plane"></i> Drone in Use');
            }
            else {
                $('.controls').removeClass('disabled');
                $('#token').removeClass('btn-danger').addClass('disabled').addClass('btn-primary');
                $('#token').html('<i class="icon-white icon-plane"></i> Fly the Drone');
            }
        });

        droneFaye.subscribe("/drone/newgame/"+guid, function(src) {
            $("#qr").remove();
  		});

        droneFaye.subscribe("/drone/freeDrone", function(data) {
            $('.controls').addClass('disabled');
            $('#snap').removeClass('disbled');
            $('#token').removeClass('btn-danger').removeClass('disabled').addClass('btn-primary');
            $('#token').html('<i class="icon-white icon-plane"></i> Fly the Drone');
        });


        //Render the whole
        if((bacon.isMobile() === true)) {
            var mobileStreamView = new MobileStreamView(model, droneFaye, $("#stream"));
            controlGyroView = new ControlGyroView(model, controller,droneFaye, $('#controlGyroView'));
            mobileJoystickView = new MobileJoystickView(model, droneFaye, $("#stream"),guid);

            if(model._isMobileBrowser){
                window.location.hash = '#stream';
            }
            else{
                stateOfDroneView = new StateOfDroneView(droneFaye, model, $('#stats'), $('#mobileBatteryProgress'));
            }
        }
        else {
            controlView = new ControlView(model, droneFaye, $('#controlView'),guid);
            var streamView = new StreamView(droneFaye, model, $('#stream'), qrDecoder);
            stateOfDroneView = new StateOfDroneView(droneFaye, model, $('#stats'), $('#batteryProgress'));
            controlKeyView = new ControlKeyView(model, droneFaye, $('#controlKeyView'));
        }
});