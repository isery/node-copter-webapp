({
	name: 'main',
	baseUrl: "javascripts",
	out: 'main-built.js',
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
		}
	}
})