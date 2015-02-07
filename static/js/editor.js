$(document).ready(function() {

	var editor = ace.edit("editor");
	editor.setTheme("ace/theme/dawn");
	editor.getSession().setMode("ace/mode/javascript");

	var editCount = 0;
	/**
	 * Emitted whenever the document is changed
	 */
	// editor.on("change",function() {

	// 	if (editCount < 5) {
	// 		editCount++;
	// 	} else {
	// 		editCount = 0;
	// 	}

	// 	//get the content in the session
	// 	var content = editor.getValue(); 

	// });

	$msgBox=$('#warning-section');
	var content = editor.getValue();
	$.get('/api', {"content":content} , function(data) {
		if (data=='success') {
			return;
		} else {
			$msgBox.show();
			$msgBox.find('#warning-msg').html(data);
		}
	});	
});
	
