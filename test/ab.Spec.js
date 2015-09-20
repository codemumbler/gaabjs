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
		var testElement;
		beforeEach(function(){
			$(document.body).append("<div class='test-ab-element'></div>");
			testElement = $('.test-ab-element');
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
	});
});
