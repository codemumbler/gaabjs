(function(){
	function ga(operation, type, category, action, label, value) {
		$(document.body).trigger('ga', [ operation, type, category, action, label, value ]);
	};

	window['ga'] = ga;
})()
