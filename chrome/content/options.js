var zdicopts = {

	// 选字释义
	enableSelect : false,
	// 即指即译
	enableCtrlHover : true,
	// "","Shift","Alt"
	ctrlHoverKey : "",
	// 调试
	debug : false,

	dialogLoad : function() {
		this.readPref();
		this.setDialog();
	},

	dialogSave : function() {
		this.readDialog();
		this.setPref();
		this.notifyBrowser();
	},

	readPref : function() {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService);
		var myprefs = prefs.getBranch("extensions.zdic@leiqin.name.");

		this.enableSelect = myprefs.getBoolPref("enableSelect");
		this.enableCtrlHover = myprefs.getBoolPref("enableCtrlHover");
		this.ctrlHoverKey = myprefs.getCharPref("ctrlHoverKey");
		this.debug = myprefs.getBoolPref("debug");
	},

	setPref : function() {
		var prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService);
		this._myprefs = prefs.getBranch("extensions.zdic@leiqin.name.");
		this._defprefs = prefs.getDefaultBranch("extensions.zdic@leiqin.name.");

		this.setPrefValue("enableSelect", this.enableSelect);
		this.setPrefValue("enableCtrlHover", this.enableCtrlHover);
		this.setPrefValue("ctrlHoverKey", this.ctrlHoverKey);
		this.setPrefValue("debug", this.debug);
	},

	_myprefs : null,
	_defprefs : null,

	setPrefValue : function(name, value, type) {
		if (!type) {
			vtype = typeof(value);
			switch(vtype) {
				case "string":
					type = "char";
					break;
				case "number":
					type = "int";
					value = Math.round(value);
					break;
				case "boolean":
					type = "bool";
					break;
			}
		}
		switch (type) {
			case "char":
				if (this._myprefs.getCharPref(name) == value) 
					return;
				if (this._defprefs.getCharPref(name) == value) {
					if (this._myprefs.prefHasUserValue(name)) {
						this._myprefs.clearUserPref(name);
						return;
					}
				}
				this._myprefs.setCharPref(name, value);
				break;
			case "bool":
				if (this._myprefs.getBoolPref(name) == value) 
					return;
				if (this._defprefs.getBoolPref(name) == value) {
					if (this._myprefs.prefHasUserValue(name)) {
						this._myprefs.clearUserPref(name);
						return;
					}
				}
				this._myprefs.setBoolPref(name, value);
				break;
			case "int":
				if (this._myprefs.getIntPref(name) == value) 
					return;
				if (this._defprefs.getIntPref(name) == value) {
					if (this._myprefs.prefHasUserValue(name)) {
						this._myprefs.clearUserPref(name);
						return;
					}
				}
				this._myprefs.setIntPref(name, value);
				break;
		}
	},

	readDialog : function() {
		this.enableSelect = document.getElementById("zdicoptIsSelect").checked;
		this.enableCtrlHover = document.getElementById("zdicoptIsCtrlHover").checked;
		var optCtrlHoverKey = document.getElementById("zdicoptCtrlHoverKey");
		this.ctrlHoverKey = optCtrlHoverKey.selectedItem.value
	},

	setDialog: function() {
		document.getElementById("zdicoptIsSelect").checked = this.enableSelect;
		document.getElementById("zdicoptIsCtrlHover").checked = this.enableCtrlHover;
		var optCtrlHoverKey = document.getElementById("zdicoptCtrlHoverKey");
		switch (this.ctrlHoverKey) {
			case "Shift":
				optCtrlHoverKey.selectedItem = document.getElementById("zdicoptCtrlHoverShiftKey");
				break;
			case "Alt":
				optCtrlHoverKey.selectedItem = document.getElementById("zdicoptCtrlHoverAltKey");
				break;
			default:
				optCtrlHoverKey.selectedItem = document.getElementById("zdicoptCtrlHoverNoKey");
		}
	},

	notifyBrowser : function() {
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
			.getService(Components.interfaces.nsIWindowMediator);
		var enumerator = wm.getEnumerator("navigator:browser");
		while(enumerator.hasMoreElements()) {
			var win = enumerator.getNext();
			if (win && win.zdic)
				win.zdic.updatePref();
		}
	}
};

// vim: foldmarker={,} foldmethod=marker
