var zdic = { 

	init : function() {
		zdic.log.m("zdic.init");
		zdic.updatePref();
		var appcontent = document.getElementById("appcontent");   // browser
		if (appcontent)
		{
			appcontent.addEventListener("load", zdic.contentLoadHandler, true);
		}
		window.addEventListener("keydown", zdic.keydownHandler, true);
	},

	updatePref : function() {
		zdicopts.readPref();
	},

	contentLoadHandler : function(evt) {
		zdic.log.m("zdic.contentLoadHandler");
		var doc = evt.originalTarget;
		if (doc instanceof HTMLDocument)
		{
			// register mouse handlers
			// we register them with content documents only because we
			// do not want the events fired when user click on menues, etc.
			doc.addEventListener("click", zdic.clickHandler, true);
			doc.addEventListener("mousemove", zdic.mousemoveHandler, true);
		}
	},

	clickHandler : function(event) {
		zdic.log.m('zdic.click');
		if (zdicopts.enableSelect)
			zdic.lookup(event);
	},

	mousemoveHandler : function(event) {
		zdic.hover.x = event.screenX;
		zdic.hover.y = event.screenY;
	},

	keydownHandler : function(event) {
		zdic.log.m("zdic.keydown event");
		var isToTranslate = false;

		if (!zdicopts.enableCtrlHover) return;

		switch (zdicopts.ctrlHoverKey) {
			case "Shift":
				if ((KeyEvent.DOM_VK_CONTROL == event.keyCode &&
							event.shiftKey && !event.altKey && !event.metaKey)
						|| (KeyEvent.DOM_VK_SHIFT == event.keyCode &&
							event.ctrlKey && !event.altKey && !event.metaKey)) {
					isToTranslate = true;
				}
				break;
			case "Alt":
				if ((KeyEvent.DOM_VK_CONTROL == event.keyCode &&
							!event.shiftKey && event.altKey && !event.metaKey)
						|| (KeyEvent.DOM_VK_ALT == event.keyCode &&
							event.ctrlKey && !event.shiftKey && !event.metaKey)) {
					isToTranslate = true;
				}
				break;
			default:
				if (KeyEvent.DOM_VK_CONTROL == event.keyCode &&
							!event.shiftKey && !event.altKey && !event.metaKey) {
					isToTranslate = true;
				}
		}

		if (isToTranslate) {
			zdic.lookup(event);
		} else {
			zdic.close();
		}
	},

	lookup : function(event) {
		var word = window.content.getSelection();
		if (word) {
			word = word.toString().trim();
		}
		if (word) {
			zdic.log.m("zdic.lookup : " + word);
			if (event.screenX)
				zdic.popup.open(event.screenX, event.screenY+18);
			else
				zdic.popup.open(zdic.hover.x, zdic.hover.y+18);
			zdiciframe = document.getElementById("zdiciframe");
			zdiciframe.src = "chrome://zdic/content/searching.html";
			if (zdic.winTimeout) {
				window.clearTimeout(zdic.winTimeout);
				zdic.winTimeout = null;
			}
			zdic.winTimeout = window.setTimeout(function() {
				zdic.log.m('zidc.seaching');
				zdiciframe.src = "http://www.zdic.net/search/?c=3&q=" + encodeURI(word);
			}, 200);
		}
	},

	winTimeout : null,

	close : function() {
		zdic.popup.close();
	},

	hover : {
		x : 0,
		y : 0,
	},

	popup : {
		obj : null,
		isShow : false,

		open : function(x, y) {
			zdic.log.m("zdic.popup.open");
			if (!zdic.popup.obj)
				zdic.popup.obj = document.getElementById("zdicpopup");

			if (zdic.popup.obj) {
				zdic.popup.obj.openPopupAtScreen(x, y, false);
			}
		},

		close : function() {
			zdic.log.m("zdic.popup.close");
			if (zdic.popup.obj) {
				if (zdic.popup.obj.state == "open")
					zdic.popup.obj.hidePopup();
			}
		},

		on : function() {
			zdic.log.m("zdic.popup.on");
			zdic.popup.isShow = true;
		},

		off : function() {
			zdic.log.m("zdic.popup.off");
			zdic.popup.isShow = false;
		},
	},

	log : {
		console : null,
		debug : false,
		m : function(msg) {
			if (!this.console) {
				this.init();
			}
			if (this.debug)
				this.console.logStringMessage(msg);
		},
		init : function() {
			this.console = Components.classes["@mozilla.org/consoleservice;1"]
				.getService(Components.interfaces.nsIConsoleService);
		},
	},
};

window.addEventListener("load", zdic.init);

// vim: foldmarker={,} foldmethod=marker
