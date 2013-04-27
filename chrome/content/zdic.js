"use strict"

var zdic = { 

	init : function() {
		zdic.log.m("zdic.init");

		if (Application.extensions) {
			zdic.firstRun(Application.extensions);
		} else {
			Application.getExtensions(zdic.firstRun);
		}

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
		zdic.button.update();
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
		}
	},

	clickHandler : function(event) {
		zdic.log.m('zdic.click');
		if (zdicopts.enableSelect)
			zdic.lookup(event);
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
			zdiciframe = document.getElementById("zdiciframe");
			zdiciframe.src = "chrome://zdic/content/searching.html";
			if (zdic.winTimeout) {
				window.clearTimeout(zdic.winTimeout);
				zdic.winTimeout = null;
			}
			zdic.winTimeout = window.setTimeout(function() {
				zdic.popup.open(window.mozInnerScreenX+MousePosTracker._x, 
						window.mozInnerScreenY+MousePosTracker._y+18);
				zdic.log.m('zdic.seaching');
				zdiciframe.src = "http://www.zdic.net/search/?c=3&q=" + encodeURIComponent(word);
			}, 200);
		}
	},

	winTimeout : null,

	close : function() {
		zdic.popup.close();
	},

	toggleSelect : function(event) {
		zdicopts.enableSelect = !zdicopts.enableSelect;
		zdicopts.setPref();
		zdicopts.notifyBrowser();
		if (zdicopts.enableSelect && !zdic.popup.isShow && event) {
			zdic.lookup(event);
		}
	},

	button : {

		update : function() {
			var zdicbutton = document.getElementById("zdicbutton");
			if (!zdicbutton) return;

			if (zdicopts.enableSelect) {
				zdicbutton.setAttribute("enableSelect", "true");
				zdicbutton.setAttribute("tooltiptext", zdic.string.get("zdic.disableSelect"));
			} else {
				zdicbutton.removeAttribute("enableSelect");
				zdicbutton.setAttribute("tooltiptext", zdic.string.get("zdic.enableSelect"));
			}
		},
	},

	menupopup : {
		
		popupshowing : function(event) {
			var toggleSelect = document.getElementById("zdic-menu-toggle-select");
			if (!toggleSelect) 
				return;

			if (zdicopts.enableSelect) {
				toggleSelect.setAttribute("label", zdic.string.get("zdic.disableSelect"));
			} else {
				toggleSelect.setAttribute("label", zdic.string.get("zdic.enableSelect"));
			}
		},

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

	openOptionsDialog : function(event) {
		zdic.log.m("zdic.openOptionsDialog");
		zdic.prefWindow.openPreferences();
	},

	prefWindow : {

		_preferencesWindow : null,

		openPreferences : function() {
			if (null == this._preferencesWindow || this._preferencesWindow.closed) {
				var instantApply =
					Application.prefs.get("browser.preferences.instantApply");
				var features =
					"chrome,titlebar,toolbar,centerscreen" +
					(instantApply.value ? ",dialog=no" : ",modal");

				this._preferencesWindow =
					window.openDialog(
							"chrome://zdic/content/options.xul",
							"zdic-preferences-window", features);
			}

			this._preferencesWindow.focus();
		},

	},

	string : {
		
		get : function(name) {
			if (!this._stringBundle) {
				this._stringBundle = document.getElementById("zdic-string-bundle");
			}
			return this._stringBundle.getString(name);
		},

		_stringBundle : null,

	},

	log : {
		console : null,
		m : function(msg) {
			if (!this.console) {
				this.init();
			}
			if (zdicopts.debug)
				this.console.logStringMessage(msg);
		},
		init : function() {
			this.console = Components.classes["@mozilla.org/consoleservice;1"]
				.getService(Components.interfaces.nsIConsoleService);
		},
	},

	firstRun : function(extensions) {
		var extension = extensions.get("zdic@leiqin.name");
		zdic.log.m("zdic.firstRun : " + extension.firstRun);
		if (extension.firstRun) {
			// add button here.
			zdic.installButton("nav-bar", "zdicbutton");
			// The "addon-bar" is available since Firefox 4
			zdic.installButton("addon-bar", "zdicbutton");
		}
	},

	/**
	 * Installs the toolbar button with the given ID into the given
	 * toolbar, if it is not already present in the document.
	 *
	 * @param {string} toolbarId The ID of the toolbar to install to.
	 * @param {string} id The ID of the button to install.
	 * @param {string} afterId The ID of the element to insert after. @optional
	 */
	installButton : function(toolbarId, id, afterId) {
		if (!document.getElementById(id)) {
			var toolbar = document.getElementById(toolbarId);

			// If no afterId is given, then append the item to the toolbar
			var before = null;
			if (afterId) {
				var elem = document.getElementById(afterId);
				if (elem && elem.parentNode == toolbar)
					before = elem.nextElementSibling;
			}

			toolbar.insertItem(id, before);
			toolbar.setAttribute("currentset", toolbar.currentSet);
			document.persist(toolbar.id, "currentset");

			if (toolbarId == "addon-bar")
				toolbar.collapsed = false;
		}
	}
};

window.addEventListener("load", zdic.init);


// vim: foldmarker={,} foldmethod=marker
