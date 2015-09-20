(function($){
	var $this = undefined;
	var experiments = [];

	var renderExperiment = function() {
		$this.text(experiments[0].value);
	};

	$.fn.ab = function(options) {
		$this = $(this);
		if (!options || !options.experiments)
			return $this;

		experiments = options.experiments;
		renderExperiment();
		return $this;
	};
})(window['jQuery']);
