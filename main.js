/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

define(function (require, exports, module) {
	"use strict";

	require('jquery-ui-1.9.2.custom.min');

	var CommandManager = brackets.getModule("command/CommandManager"),
		EditorManager = brackets.getModule("editor/EditorManager"),
		ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
		Editor = brackets.getModule("editor/Editor").Editor,
		DocumentManager = brackets.getModule("document/DocumentManager"),
		EditorUtils = brackets.getModule("editor/EditorUtils"),
		Menus = brackets.getModule("command/Menus"),
		COMMAND_ID = "me.drewh.brackets.minimap";

	var loadCSSPromise = ExtensionUtils.loadStyleSheet(module, 'main.css');


	function _change(text) {
		$('#mini-map-code').html(text);
	}

	function _drawMap() {
		$('.main-view').append('<div id="mini-map"><div class="selection"></div><div class="cm-s-default" id="mini-map-code"></div></div>');
	}

	function lineToPx(line) {
		return line * 4;
	}


	function pxToLine(px) {
		return px / 4;
	}


	function _documentChange() {

		var miniSelectionEl = $('#mini-map .selection');
		var drag = false;
		var height = $(window).height();

		var editor = EditorManager.getCurrentFullEditor();

		var lineCount = editor.lineCount();

		console.log(lineCount);
		console.log(editor.totalHeight(true));

		var doc = DocumentManager.getCurrentDocument();
		//var doc = editor.document;	

		if (doc) {
			console.log($('.CodeMirror-lines div div:eq(2)').html());
			_change($('.CodeMirror-lines div div:eq(2)').html());

			$(doc).on('change', function () {
				_change($('.CodeMirror-lines div div:eq(2)').html());
			});

			miniSelectionEl.css({
				height: lineToPx(68) + 'px'
			});

			//			miniSelectionEl.draggable({
			//				containment: "parent",
			//				start: function () {
			//					drag = true;
			//				},
			//				drag: function () {
			//					drag = true;
			//					var x = editor.getScrollPos().x;
			//					var y = $('#mini-map .selection').offset().top - 40;
			//					editor.setScrollPos(x, y);
			//				},
			//				stop: function () {
			//					drag = false;
			//				}
			//			});
			//
			//			$(editor).on('scroll', function () {
			//				if (drag === false) {
			//					var y = editor.getScrollPos().y / 10;
			//					miniSelectionEl.css({
			//						'top': y + 'px'
			//					});
			//				}
			//			});
		}
	}



	loadCSSPromise.then(function () {
		_drawMap();
		_documentChange();
		$(DocumentManager).on('currentDocumentChange', function (e) {
			_documentChange();
		});
	});

});