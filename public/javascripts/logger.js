define(function() {
	return function(message) {
		if(typeof(console) !== undefined) {
			console.log(message);
		}
	};
});