var zdic = { 

	options : {

		// 选字释义
		enableSelect : false,
		// 即指即译
		enableCtrlHover : true,
		// "","Shift","Alt"
		ctrlHoverKey : "",

		load : function() {
			this.readPref();
			this.setDialog();
		},

		save : function() {
			this.readDialog();
			this.setPref();
		},

		readPref : function() {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService);
			var myprefs = prefs.getBranch("extensions.zdic.");

			this.enableSelect = myprefs.getBoolPref("enableSelect");
			this.enableCtrlHover = myprefs.getBoolPref("enableCtrlHover");
			this.ctrlHoverKey = myprefs.getCharPref("ctrlHoverKey");
		},

		setPref : function() {
			var prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService);
			var myprefs = prefs.getBranch("extensions.zdic.");
			
			myprefs.setBoolPref("enableSelect", this.enableSelect);
			myprefs.setBoolPref("enableCtrlHover", this.enableCtrlHover);
			myprefs.setCharPref("ctrlHoverKey", this.ctrlHoverKey);
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
	}
}

// vim: foldmarker={,} foldmethod=marker
