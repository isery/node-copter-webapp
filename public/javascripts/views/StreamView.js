define(['jQuery', 'logger', 'grid', 'version', 'detector', 'formatinf', 'errorlevel', 'bitmat', 'datablock', 'bmparser', 'datamask', 'rsdecoder', 'gf256poly', 'gf256', 'decoder', 'qrcode', 'findpat', 'alignpat', 'databr'],
function($, logger, grid, version, detector, formatinf, errorlevel, bitmat, datablock, bmparser, datamask, rsdecoder, gf256poly, gf256, decoder, qrcode, findpat, alignpat, databr) {
	var StreamView = function (droneFaye, model, $element, jCanvas) {
		this.model=model;
		this.droneFaye = droneFaye;
        this.element = $element;
        this.canvas = jCanvas;
        this.context = this.canvas.getContext("2d");
        this.qrImage = new Image();
        var that = this;
        this.qrImage.onload = function(){
            try{
                qrcode.decode(that.qrImage.src);
                qrcode.callback = function (data){
                    console.log(data)
                };
            }
            catch(e){
            }
        };
        this.render();

		this.droneFaye.subscribe("/drone/image", function(src) {
            that.qrImage.src = src;    		
            $("#cam").attr({src: src});
  		});
	};

 

	StreamView.prototype.render = function () {
        this.element.append('<img id="cam" src="default.jpg" />');
	};
	return StreamView;
});

