/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, CodeMirror, document */

define(function (require, exports, module) {
	"use strict";

	require('jquery-ui-1.9.2.custom.min');
	require('runmode');

	var CommandManager = brackets.getModule("command/CommandManager"),
		EditorManager = brackets.getModule("editor/EditorManager"),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		Editor = brackets.getModule("editor/Editor").Editor,
		DocumentManager = brackets.getModule("document/DocumentManager"),
		EditorUtils = brackets.getModule("editor/EditorUtils"),
		Menus = brackets.getModule("command/Menus"),
		COMMAND_ID = "me.drewh.brackets.minimap";


	var loadCSSPromise = ExtensionUtils.loadStyleSheet(module, 'main.css');


	function _drawMap() {
		$('.main-view').append('<div id="mini-map"><div class="selection"></div><pre class="cm-s-default" id="mini-map-code"></pre></div>');
	}

	function lineToPx(line) {
		return line * 4;
	}

	function pxToLine(px) {
		return px / 8.4;
	}

	/* function _documentChange() {
		
        var editor = EditorManager.getCurrentFullEditor();
        $(editor).on('scroll', function(e){
            var height = $(editor.getScrollerElement()).height();
            var totalHeight = editor.totalHeight(true);
            var miniSelectionEl = $('#mini-map .selection')[0];     
            miniSelectionEl.style.top = (e.delegateTarget.scrollTop/(totalHeight-height))*height+e.delegateTarget.scrollTop+"px";
        });
        _documentUpdate();
    }*/

	function _updateMiniMap(editor) {

		var doc = editor.document;
		var text = doc.getText();

		var fileType = editor.getModeForDocument();

		if (fileType === 'htmlmixed') {
			fileType = 'html';
		}
		
		CodeMirror.runMode(text, "text/" + fileType, document.getElementById("mini-map-code"));
	}

	function _documentChange() {

		var miniSelectionEl = $('#mini-map .selection');

		var editor = EditorManager.getCurrentFullEditor();
		var doc = editor.document;

		var height = $(editor.getScrollerElement()).height();
		var width = $(editor.getScrollerElement()).width();
		var lineCount = editor.lineCount();
		var totalHeight = editor.totalHeight(true);

		var ratio = (height - 200) / totalHeight;

		// $("#mini-map").css('-webkit-transform', 'scale('+ratio+','+ratio+')');

		if (doc) {

			_updateMiniMap(editor);

			miniSelectionEl.css({
				height: pxToLine(height) + 'px'
			});

			/* miniSelectionEl.css({
				height: height + 'px',
                width: width + 'px'
			}); */
		}
	}

	loadCSSPromise.then(function () {
		_drawMap();
		_documentChange();
		$(DocumentManager).on('currentDocumentChange', _documentChange);
	    $(DocumentManager).on('documentSaved', _documentChange);
	});


});