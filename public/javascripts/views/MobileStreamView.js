define(['jQuery', 'logger'], function($, logger) {
	var MobileStreamView = function (model, droneFaye, $element) {
		this.model=model;
		this.droneFaye = droneFaye;
        this.element = $element;
        this.element.addClass("mobileView");
		var that = this;
        this.render();
		this.droneFaye.subscribe("/drone/image", function(src) {
    		$("#cam").attr({src: src});
  		});


	};

 

	MobileStreamView.prototype.render = function () {
        this.element.append('<img id="cam" src="default.jpg" />');
	};
	return MobileStreamView;
});

