describe('AB Testing', function() {
	var testElement;
	beforeEach(function(){
		$(document.body).append('<div class="test-ab-element"/>');
		testElement = $('.test-ab-element');
		Math.random = function() {
			return 0;
		};
	});

	afterEach(function() {
		$('.test-ab-element').remove();
		document.cookie = 'codemumblerAB_index=;';
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
		it('define text experiments', function() {
			testElement.ab({
				'experiments':[{
					'value': 'experiment A'
				}]
			});
			expect(testElement.text()).toBe('experiment A');
		});

		it('define 2 text experiments - pick A', function() {
			testElement.ab({
				'experiments':[{
					'value': 'experiment A'
				},{
					'value': 'experiment B'
				}]
			});
			expect(testElement.text()).toBe('experiment A');
		});

		it('define 2 text experiments - pick B', function() {
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

		it('experiment is a function', function() {
			testElement.ab({
				'experiments':[{
					'value': function(element) {
						$(element).addClass('experimentA');
					}
				}]
			});
			expect(testElement.hasClass('experimentA')).toBe(true);
		});

		it('query parameter force selection', function() {
			window.location.href += "#?ab=0";
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
			expect(testElement.text()).toBe('experiment A');
			window.location.href = window.location.href.replace('#?ab=0','#');
		});

		it('empty query parameter force random selection', function() {
			window.location.href += "#?ab";
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
			window.location.href = window.location.href.replace('#?ab','#');
		});
	});

	describe('Cookie tests - ', function() {
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

		describe('Experiment survives refresh via cookie', function() {
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

			it('named experiments in cookie value', function(){
				Math.random = function() {
					return 0;
				};
				testElement.ab({
					'name': 'experiment1',
					'experiments':[{
						'value': 'experiment 1A'
					},{
						'value': 'experiment 1B'
					}]
				});
				expect(readCookie('codemumblerAB_index')).toBe('experiment1=0');
			});

			it('2 experiments on the same page', function() {
				Math.random = function() {
					return 0;
				};
				testElement.ab({
					'name': 'experiment1',
					'experiments':[{
						'value': 'experiment 1A'
					},{
						'value': 'experiment 1B'
					}]
				});
				Math.random = function() {
					return 0.9;
				};
				testElement.ab({
					'name': 'experiment2',
					'experiments':[{
						'value': 'experiment 2A'
					},{
						'value': 'experiment 2B'
					}]
				});
				expect(readCookie('codemumblerAB_index')).toBe('experiment1=0,experiment2=1');
			});

			it('named experiment load from cookie', function() {
				setCookie('codemumblerAB_index', 'experiment1=0', 1);
				testElement.ab({
					'name': 'experiment1',
					'experiments':[{
						'value': 'experiment 1A'
					},{
						'value': 'experiment 1B'
					}]
				});
				expect(testElement.text()).toBe('experiment 1A');
			});

			it('2 experiments load from cookie on the same page', function() {
				setCookie('codemumblerAB_index', 'experiment1=0,experiment2=1', 1);
				testElement.ab({
					'name': 'experiment1',
					'experiments':[{
						'value': 'experiment 1A'
					},{
						'value': 'experiment 1B'
					}]
				});
				testElement.ab({
					'name': 'experiment2',
					'experiments':[{
						'value': 'experiment 2A'
					},{
						'value': 'experiment 2B'
					}]
				});
				expect(testElement.text()).toBe('experiment 2B');
			});
		});
	});

	describe('async tests', function() {
		var originalTimeout, originalAjax;
		beforeEach(function() {
			originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
			jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
		});

		afterEach(function() {
			jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
		});

		it('fires GA event', function(done) {
			$(document.body).on('ga', function gaCallback(event, operation, type, category, action, label) {
				var gaArgs = [ operation, type, category, action, label ];
				expect(gaArgs.join(',')).toEqual('send,event,text change,experiment,A');
				done();
				$(document.body).off('ga', gaCallback);
			});
			testElement.ab({
				'category': 'text change',
				'action': 'experiment',
				'experiments':[{
					'label': 'A',
					'value': 'experiment A'
				}]
			});
		});

		it('no GA available', function(){
			var tempGA = window['ga'];
			window['ga'] = undefined;
			try {
				testElement.ab({
					'category': 'text change',
					'action': 'experiment',
					'experiments':[{
						'label': 'A',
						'value': 'experiment A'
					}]
				});
			} catch (e) {
				fail('Should be no error');
			}
			expect(true).toBe(true);
			window['ga'] = tempGA;
		});
	});
});
