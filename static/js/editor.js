$(document).ready(function() {

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/dawn");
	editor.getSession().setMode("ace/mode/javascript");

	var typingTimer;
	/**
	 * Emitted whenever the document is changed
	 */
	editor.on("change",function() {
		clearTimeout(typingTimer);
		typingTimer = setTimeout(run, 2000);
	});

	function run(){
		$msgBox=$('#warning-section');
		var content = editor.getValue();
		$.get('/api', {"content":content} , function(data) {
			if (data=='success') {
				$msgBox.hide();
			} else {
				$msgBox.show();
				$msgBox.find('#warning-msg').html(data);
			}
		});	
	}
});
	
