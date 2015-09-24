describe('AB Testing', function() {

	afterEach(function() {
		document.cookie = "codemumblerAB_index=;";
	});

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
				return 0;
			};
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
			Math.random = function() {
				return 0.9;
			};
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

	describe('Cookie tests - ', function() {
		var testElement;
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

		function setCookie(cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		};

		beforeEach(function(){
			$(document.body).append("<div class='test-ab-element'/>");
			testElement = $('.test-ab-element');
		});

		afterEach(function(){
			$('.test-ab-element').remove();
		});

		describe('Experiment survives refresh via cookie', function() {
			beforeEach(function(){
				setCookie('codemumblerAB_index', '0', 1);
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

		describe('Saves experiment index', function() {
			it('Creates cookie', function() {
				Math.random = function() {
					return 0.9;
				};
				testElement.ab({
					'experiments':[{
						'value': 'experiment A'
					},{
						'value': 'experiment B'
					}]
				});
				expect(readCookie('codemumblerAB_index')).toBe('1');
			});
		});
	});
});
