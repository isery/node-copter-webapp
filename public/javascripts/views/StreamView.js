define(['jQuery', 'logger'], function($, logger) {
	var StreamView = function (droneFaye, model, $element, qrDecoder) {
		this.model=model;
		this.droneFaye = droneFaye;
        this.element = $element;
        this.qrDecoder = qrDecoder;
        var that = this;
        this.statistics = [];

        $(".btn-player").click(function() {
        	var name = $('playerNameInput').val();
        });
        $("#intro .btn-player").on("click", this.onBtnPlayerClick);

        


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
                <table id="qr" class="table table-striped table-bordered">\
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
        var name = "Noname";
        if ($("#playerNameInput").val()) {
            name = $("#playerNameInput").val();
        }
 		that.droneFaye.publish("/drone/halloffame", {
				data:name
			});
        e.preventDefault();
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
					$("#qr>tbody").append('<tr class="blinkLine"><td>'+index+'</td><td id ='+value+'>'+this.statistics[index]+'</td></tr>');
				}
				if(index == 2) {
					$('body').append('<div id="intro" class="intro active">\
									    <div class="overlay1"></div>\
									    <div class=content>\
									        <h2>Enter Name for Hall of Fame!</h2>\
									        <p>Fachhochschule Salzburg - MMT-B2011<br>Eschbacher Georg + Hettegger Michael</p>\
									        <input id="playerNameInput" type="text" name="playerName" placeholder="Enter Playername"/>\
									        <a class="btn-player" href="#">weiter</a>\
									    </div>\
									</div>');
				}
				//$("tbody").append('<tr><td>'+index+'</td><td id ='+value+'>'+this.statistics[index]+'</td></tr>');
			}
		}
	};

	
	return StreamView;
});

