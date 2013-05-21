var exec = require('child_process').exec

exports.makeVideo = function(callback) {
	var date = new Date;
	var framerate = '1/5'; //1 Bild 5 Sekunden :Debug
	var filename = date.getTime()+'.mp4';
	var inputfiles = "./video/'*.png'";
	var test = exec("ffmpeg -r "+framerate+" -pattern_type glob -i "+inputfiles  +" -c:v libx264 -profile:v high -crf 23 -pix_fmt yuv420p -r 30 ./video/"+filename+"",
	  function (error, stdout, stderr) {
	    if (error !== null) {
	      filename = "error"
	    }
	    callback(filename);
	});
}