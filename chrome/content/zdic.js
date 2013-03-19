var zdic = { 

	init : function() {
		zdic.log.m("init");
		window.addEventListener("keydown", zdic.keydownHandler, true);
	},

	clickHandler : function(event) {
	},

	keydownHandler : function(event) {
		zdic.log.m("keydown event");
		var isToTranslate = false;

		if (!zdicopts.isCtrlHover) return;

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
				if ((KeyEvent.DOM_VK_CONTROL == event.keyCode &&
							!event.shiftKey && event.altKey && !event.metaKey)
						|| (KeyEvent.DOM_VK_ALT == event.keyCode &&
							event.ctrlKey && !event.shiftKey && !event.metaKey)) {
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
		var word = document.getSelection();
		if (word) {
			word = word.trim();
		}
		if (word) {
			//TODO
			zdic.log.m("lookup : " + word);
		}
	},

	close : function() {
	},

	log : {
		console : null,
		debug : true,
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
