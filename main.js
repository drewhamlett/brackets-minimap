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
        return px / 8.4;
	}

    function _documentChange() {
        var editor = EditorManager.getCurrentFullEditor();
        $(editor).on('scroll', function(e){
            var height = $(editor.getScrollerElement()).height();
            var totalHeight = editor.totalHeight(true);
            var miniSelectionEl = $('#mini-map .selection')[0];
            //console.log(miniSelectionEl);
            miniSelectionEl.style.top = (e.delegateTarget.scrollTop/(totalHeight-height))*height+e.delegateTarget.scrollTop+"px";
        });
        _documentUpdate();
    }

	function _documentUpdate() {

		var miniSelectionEl = $('#mini-map .selection');
		var drag = false;

		var editor = EditorManager.getCurrentFullEditor();
        
        var height = $(editor.getScrollerElement()).height();
        var width = $(editor.getScrollerElement()).width();
		
		var lineCount = editor.lineCount();
		
		console.log(lineCount);
		var totalHeight = editor.totalHeight(true);
        
        var ratio = (height-200)/totalHeight;
        //console.log();
		console.log(editor.totalHeight(true) + ' ' + height );
		var doc = editor.document;
        console.log(ratio);
        // translate(0px, -'+(height-(height*ratio/2))*2+'px)'
        $("#mini-map").css('-webkit-transform', 'scale('+ratio+','+ratio+')');
		//var doc = editor.document;	
        
		if (doc) {
			//console.log($('.CodeMirror-lines div div:eq(2)').html());
            _change(editor.getScrollerElement().children[0].children[0].children[1].innerHTML);

			miniSelectionEl.css({
				height: height + 'px',
                width: width + 'px'
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
		$(DocumentManager).on('currentDocumentChange', _documentChange);
        $(DocumentManager).on('documentSaved', _documentUpdate);
	});

});