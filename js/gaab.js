(function($){
	var $this = undefined;
	var name;
	var experiments = [];
	var COOKIE_NAME = 'codemumblerAB_index';

	function readCookie(cname) {
		var cookieName = cname + '=';
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(cookieName) == 0) {
					var value = c.substring(cookieName.length,c.length);
					if (value)
						return value;
				}
		}
		return null;
	};

	function setCookie(cname, cvalue, exdays) {
		cvalue = '' + cvalue;
		var fullValue = readCookie(cname) || cvalue;
		if (cvalue.indexOf('=') !== -1) {
			var indexOfName = fullValue.indexOf(cvalue.split('=')[0]);
			if (indexOfName === -1) {
				fullValue += ',' + cvalue;
			} else {
				var endIndex = fullValue.indexOf(',', indexOfName);
				if (endIndex == -1)
					endIndex = fullValue.length;
				fullValue = fullValue.replace(fullValue.substring(indexOfName, endIndex), cvalue);
			}
		}
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + fullValue + "; " + expires;
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
			if (name && savedIndex != null) {
				var nameList = savedIndex.split(',');
				for (var i = 0; i<nameList.length; i++){
					if (nameList[i].indexOf(name) > -1)
						savedIndex = nameList[i].split('=')[1];
				}
			}
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
		if (name)
			setCookie(COOKIE_NAME, name + '=' + index, 1);
		else
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
		name = options.name;
		experiments = options.experiments;
		renderExperiment(getIndex());
		tracking(options, getIndex());
		return $this;
	};
})(window['jQuery']);
