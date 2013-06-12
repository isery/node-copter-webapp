define(['jQuery', 'logger', 'keydrown'], function($, logger, kd) {
	var StreamView = function (droneFaye, model, $element, qrDecoder) {
		this.model=model;
		this.droneFaye = droneFaye;
        this.element = $element;
        this.qrDecoder = qrDecoder;
        this.introActive = true;
        
        this.statistics = [];
        $(".btn-player").click(function() {
        	var name = $('playerNameInput').val();
        });
        $("#intro .btn-player").on("click", this.onBtnPlayerClick.bind(this));
		var that = this;
        window.addEventListener("keydown", function(e) {
		    if([13].indexOf(e.keyCode) > -1) {
		        that.onBtnPlayerClick(e);
		    }
		}, false);


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
        $('#stats').append('\
                <table id="qr" class="table table-bordered">\
                    <tr>\
                        <th>QR-Code</th>\
                        <th>Number of Scanns</th>\
                    </tr>\
                </table>\
                ');
	};

	StreamView.prototype.onBtnPlayerClick = function(e) {
        $("#intro .btn-player").off("click", this.onBtnPlayerClick);
        $("#intro").removeClass("active");
        var name = "No Name";
        if ($("#playerNameInput").val()) {
            name = $("#playerNameInput").val();
        }
 		this.droneFaye.publish("/drone/halloffame", {
				data:name
			});

 		kd.run(function () {
  			kd.tick();
		});
		
        e.preventDefault();
	};

	StreamView.prototype.renderStatistics = function () {
		var value, counter=0;
		for(var index in this.statistics) {
			if(this.statistics.hasOwnProperty(index)) {
				counter++;
				value = index.toLowerCase().replace(/[^0-9a-z-]/g,"");
				//value = index.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,'');;
				if(($("#"+value).length)>0){
					$("#"+value).html(this.statistics[index]);
				}
				else {
					$("#qr>tbody").append('<tr class="blinkLine"><td>'+index+'</td><td id ='+value+'>'+this.statistics[index]+'</td></tr>');
				}
				if(counter == 3 && this.introActive) {
					kd.stop();
					this.introActive = false;
					$("#intro").addClass('active');
				}
			}
		}
	};

	
	return StreamView;
});

