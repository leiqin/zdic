var defaultOptions = {
	enableSelect: true,
	enableContentMenu: true,
	enableCtrlHover: false,
	ctrlHoverKey: "Alt"
};

// Saves options to chrome.storage
function save_options() {
	var enableSelect = document.getElementById('enableSelect').checked;
	var enableContentMenu = document.getElementById('enableContentMenu').checked;
	var enableCtrlHover = document.getElementById('enableCtrlHover').checked;
	var ctrlHoverKey = document.getElementById('ctrlHoverKey').value;
	chrome.storage.sync.set({
		enableSelect: enableSelect,
		enableContentMenu: enableContentMenu,
		enableCtrlHover: enableCtrlHover,
		ctrlHoverKey: ctrlHoverKey
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = chrome.i18n.getMessage('optionSaved');
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	chrome.storage.sync.get(defaultOptions, function(items) {
		document.getElementById('enableSelect').checked = items.enableSelect;
		document.getElementById('enableContentMenu').checked = items.enableContentMenu;
		document.getElementById('enableCtrlHover').checked = items.enableCtrlHover;
		document.getElementById('ctrlHoverKey').value = items.ctrlHoverKey;
	});
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('enableSelect').addEventListener('click', save_options);
document.getElementById('enableContentMenu').addEventListener('click', save_options);
document.getElementById('enableCtrlHover').addEventListener('click', save_options);
document.getElementById('ctrlHoverKey').addEventListener('change', save_options);

language_span_ids = ['enableSelect', 'enableContentMenu', 'enableCtrlHover', 'ctrlHoverKey'];

for (var i = 0; i < language_span_ids.length; i++) {
	span_id = language_span_ids[i];
	document.getElementById('lang_' + span_id).innerText = chrome.i18n.getMessage(span_id);
}
