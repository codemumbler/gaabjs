describe('AB Testing', function() {

	describe('AB plugin', function() {
		it('jquery plugin', function() {
			expect(typeof $.fn.ab).toBe('function');
		});

		it('ensure chaining possible', function(){
			var expected = $(document.body);
			expect(expected.ab({})).toEqual(expected);
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
});
