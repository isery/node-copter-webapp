define(['jQuery', 'logger'], function($, logger) {
	var StreamView = function (droneFaye, model, $element, qrDecoder) {
		this.model=model;
		this.droneFaye = droneFaye;
        this.element = $element;
        this.qrDecoder = qrDecoder;
        var that = this;
        this.statistics = [];

        this.render();

		this.droneFaye.subscribe("/drone/image", function(src) {
            that.qrDecoder.setQrCodeSrc(src);  
            that.model.setCurrentImg(src); 		
            $("#cam").attr({src: src});
  		});

  		this.droneFaye.subscribe("/drone/qrcodecounter", function(data) {
  			var key = data.key;
  			var count = data.count;
  			console.log("qrcount streamview");
  			that.statistics[key] = count;
  			that.renderStatistics();
  		});

  		$(this.qrDecoder).on("QRCODE", function(e) {
			console.log(e.data);
			that.droneFaye.publish("/drone/qrcode", {
				code:e.data
			});
		});
	};

	StreamView.prototype.render = function () {
        this.element.append('<img id="cam" src="default.jpg" />');
	};

	StreamView.prototype.renderStatistics = function () {
		console.log("rendern von statistics");
		for(var item in this.statistics) {
			this.element.append('<span>Key:'+ item +' count: '+item[i]);
		} 
	};

	
	return StreamView;
});

