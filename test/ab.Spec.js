describe('AB Testing', function() {

	describe('AB', function() {
		it('jquery plugin', function() {
			expect(typeof $.fn.ab).toBe('function');
		});
	});
});
