/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

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


	function _change(text) {
		$('#mini-map-code').html(text);
	}

	function _drawMap() {
		$('.main-view').append('<div id="mini-map"><div class="selection"></div><pre id="mini-map-code" class="cm-s-default"></pre></div>');
	}

	function lineToPx(line) {
		return line * 4;
	}


	function pxToLine(px) {
        return px / 8.4;
	}

    function _documentChange() {
        //try{
            var editor = DocumentManager.getCurrentDocument()._masterEditor;
            var drag = false;
            
            var height = $(editor.getScrollerElement()).height();
            var width = $(editor.getScrollerElement()).width();
            
            var lineCount = editor.lineCount();
            
            console.log(lineCount);
            
            
            var miniSelectionEl = $('#mini-map .selection');
            miniSelectionEl.css({
                height: height + 'px',
                width: width + 'px'
            });
            
            miniSelectionEl.draggable({
                containment: "parent",
                start: function () {
                    drag = true;
                },
                drag: function () {
                    drag = true;
                    var x = editor.getScrollPos().x;
                    var y = $('#mini-map .selection').offset().top;
                    editor.setScrollPos(x, y);
                },
                stop: function () {
                    drag = false;
                }
            });
            
            _documentUpdate();

            var totalHeight = $("#mini-map").height();
            console.log(editor.totalHeight(true) + ' ' + height );
            var ratio = (height)/totalHeight;
            $("#mini-map").css('-webkit-transform', 'scale('+ratio+')');
            console.log($("#mini-map").height());
            $(editor).on('scroll', function(e){
                if(!drag){
                    var height = $(editor.getScrollerElement()).height();
                    var totalHeight = editor.totalHeight(true);
                    var miniSelectionEl = $('#mini-map .selection')[0];
                    //console.log(miniSelectionEl);
                    miniSelectionEl.style.top = (e.delegateTarget.scrollTop/(totalHeight-height))*height+e.delegateTarget.scrollTop+"px";
                }
            });
        /*} catch (e){
            console.log("the document probably wasn't ready yet");
            console.log(e);
        }*/
    }

	function _documentUpdate() {

		//var miniSelectionEl = $('#mini-map .selection');
		//var drag = false;

        //console.log();
		
		var doc = DocumentManager.getCurrentDocument();
        //var editor = doc._masterEditor;
        //console.log(ratio);
        // translate(0px, -'+(height-(height*ratio/2))*2+'px)'
        
		//var doc = editor.document;	
        
		if (doc) {
			//console.log($('.CodeMirror-lines div div:eq(2)').html());
            CodeMirror.runMode(doc.getText(), "application/xml", document.getElementById("mini-map-code"));

			

						
			
						/*$(editor).on('scroll', function () {
							if (drag === false) {
								var y = editor.getScrollPos().y / 10;
								miniSelectionEl.css({
									'top': y + 'px'
								});
							}
						});*/
		}
	}



	loadCSSPromise.then(function () {
		_drawMap();
		_documentChange();
		$(DocumentManager).on('currentDocumentChange', _documentChange);
        $(DocumentManager).on('documentSaved', _documentUpdate);
	});

});