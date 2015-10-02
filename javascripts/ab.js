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
				if (c.indexOf(name) == 0) {
					var value = c.substring(name.length,c.length);
					if (value)
						return value;
				}
		}
		return null;
	};

	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	};

	var getIndex = function() {
		var index = 0;
		if (window.location.href.indexOf('?ab') !== -1) {
			if (window.location.href.indexOf("?ab=") == -1)
				index = Math.floor(Math.random() * experiments.length);
			else
				index = window.location.href.substring(window.location.href.indexOf("?ab=")+4);
		} else {
			var savedIndex = readCookie(COOKIE_NAME);
			if (savedIndex !== null && savedIndex < experiments.length) {
				index = savedIndex;
			} else {
				index = Math.floor(Math.random() * experiments.length);
			}
		}
		return index;
	};

	var renderExperiment = function(index) {
		var experiment = experiments[index].value;
		if (typeof experiment === 'string') {
			$this.text(experiment);
		} else {
			experiment($this);
		}
		setCookie(COOKIE_NAME, index, 1);
	};

	var tracking = function(options, index) {
		if (typeof ga !== 'undefined')
			ga('send', 'event', options.category, options.action, experiments[index].label);
	};

	$.fn.ab = function(options) {
		$this = $(this);
		if (!options || !options.experiments)
			return $this;
		experiments = options.experiments;
		renderExperiment(getIndex());
		tracking(options, getIndex());
		return $this;
	};
})(window['jQuery']);