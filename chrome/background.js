chrome.browserAction.onClicked.addListener(function(tab) {
	//console.log('browserAction click');
	chrome.storage.sync.get({enableSelect: true}, function(items) {
		//console.log('browserAction click get option');
		chrome.storage.sync.set({enableSelect: !items.enableSelect}, function() {
			//console.log('browserAction click set option');
		});
	});
});

chrome.storage.sync.get({enableSelect: true}, function(items) {
	setBrowerActionIcon(items.enableSelect);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (namespace == 'sync') {
		if ('enableSelect' in changes) {
			setBrowerActionIcon(changes.enableSelect.newValue);
		}
	}
});

function setBrowerActionIcon(enableSelect) {
	if (enableSelect) {
		chrome.browserAction.setTitle({title: chrome.i18n.getMessage('disableSelect')});
		chrome.browserAction.setIcon({path:{
			'38': 'icon/logo38.png'
		}});
	} else {
		chrome.browserAction.setTitle({title: chrome.i18n.getMessage('enableSelect')});
		chrome.browserAction.setIcon({path:{
			'38': 'icon/logogray38.png'
		}});
	}
}
