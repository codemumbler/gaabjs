(function($){
	var $this = undefined;
	var experiments = [];
	var COOKIE_NAME = 'codemumblerAB_index';

	function readCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return null;
	};

	var getIndex = function() {
		var index = 0;
		var savedIndex = readCookie(COOKIE_NAME);
		if (savedIndex !== null && savedIndex < experiments.length) {
			index = savedIndex;
		} else {
			index = Math.floor(Math.random() * experiments.length);
		}
		return index;
	};

	var renderExperiment = function(index) {
		$this.text(experiments[index].value);
	};

	$.fn.ab = function(options) {
		$this = $(this);
		if (!options || !options.experiments)
			return $this;
		experiments = options.experiments;
		renderExperiment(getIndex());
		return $this;
	};
})(window['jQuery']);
