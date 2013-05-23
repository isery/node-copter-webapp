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
  			that.statistics[key] = count;
  			that.renderStatistics();
  		});

  		$(this.qrDecoder).on("QRCODE", function(e,data) {
			that.droneFaye.publish("/drone/qrcode", {
				code:data.data
			});
		});
	};

	StreamView.prototype.render = function () {
        this.element.append('<img id="cam" src="default.jpg" />');
        $("#attention").css("opacity","100");
        $("#attention").hide();
	};

	StreamView.prototype.renderStatistics = function () {
		var value;
		for(var index in this.statistics) {
			if(this.statistics.hasOwnProperty(index)) {
				value = index.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');;
				if(($("#"+value).length)>0){
					$("#"+value).html(this.statistics[index]);
				}
				else {
					$("tbody").append('<tr><td>'+index+'</td><td id ='+value+'>'+this.statistics[index]+'</td></tr>');
				}
				//$("tbody").append('<tr><td>'+index+'</td><td id ='+value+'>'+this.statistics[index]+'</td></tr>');
			}
		}
	};

	
	return StreamView;
});

