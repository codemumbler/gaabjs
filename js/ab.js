(function($){
	var $this = undefined;
	var experiments = [];

	var renderExperiment = function() {
		var index = Math.floor(Math.random() * experiments.length);
		$this.text(experiments[index].value);
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
