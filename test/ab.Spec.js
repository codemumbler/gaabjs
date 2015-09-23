describe('AB Testing', function() {

	describe('AB plugin', function() {
		it('jquery plugin', function() {
			expect(typeof $.fn.ab).toBe('function');
		});

		it('ensure chaining possible', function(){
			var expected = $(document.body);
			expect(expected.ab({}).is('body')).toEqual(true);
		});
	});

	describe('AB set experiments', function() {
		var testElement, randomValue;
		beforeEach(function(){
			$(document.body).append("<div class='test-ab-element'/>");
			testElement = $('.test-ab-element');
			Math.random = function() {
				return randomValue();
			};
			randomValue = function(){ return 0 };
		});

		afterEach(function(){
			$('.test-ab-element').remove();
		});

		it('define text alternatives', function() {
			testElement.ab({
				'experiments':[{
					'value': 'experiment A'
				}]
			});
			expect(testElement.text()).toBe('experiment A');
		});

		it('define 2 text alternatives - pick A', function() {
			testElement.ab({
				'experiments':[{
					'value': 'experiment A'
				},{
					'value': 'experiment B'
				}]
			});
			expect(testElement.text()).toBe('experiment A');
		});

		it('define 2 text alternatives - pick B', function() {
			randomValue = function(){ return 0.9 };
			testElement.ab({
				'experiments':[{
					'value': 'experiment A'
				},{
					'value': 'experiment B'
				}]
			});
			expect(testElement.text()).toBe('experiment B');
		});
	});

	describe('Experiment survives refresh via cookie', function() {
		var testElement;
		function setCookie(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		}
		beforeEach(function(){
			$(document.body).append("<div class='test-ab-element'/>");
			testElement = $('.test-ab-element');
			setCookie('codemumblerAB_index', '0', 1);
		});

		afterEach(function(){
			$('.test-ab-element').remove();
			setCookie('codemumblerAB_index', '0', 0);
		});

		it('Uses cookie value', function() {
			testElement.ab({
				'experiments':[{
					'value': 'experiment A'
				},{
					'value': 'experiment B'
				}]
			});
			expect(testElement.text()).toBe('experiment A');
		});
	});
});
