$(document).ready(function(){
	$("#test").ab({
		'name': 'intro-text',
		'experiments':[{
			'value': 'This is how easy-to-use it is.'
		},{
			'value': 'How easy-to-use is it?  This easy.'
		}]
	});

	$('button.download-now').ab({
		'name': 'button-experiment',
    'experiments':[{
      'value': function(element) {
        $(element).removeClass('btn-success').addClass('btn-primary');
      }
    },{
      'value': function(element) {
        $(element).text($(element).text() + '!');
      }
    }]
  });
});
