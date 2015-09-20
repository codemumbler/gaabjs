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
});
