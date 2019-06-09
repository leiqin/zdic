chrome.browserAction.onClicked.addListener(function(tab) {
	//console.log('browserAction click');
	chrome.storage.sync.get({enableSelect: true}, function(items) {
		//console.log('browserAction click get option');
		chrome.storage.sync.set({enableSelect: !items.enableSelect}, function() {
			//console.log('browserAction click set option');
		});
	});
});

chrome.storage.sync.get({enableSelect: true, enableContentMenu: true}, function(items) {
	setBrowerActionIcon(items.enableSelect);
	changeContentMenu(items.enableContentMenu);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	if (namespace == 'sync') {
		if ('enableSelect' in changes) {
			setBrowerActionIcon(changes.enableSelect.newValue);
		}
		if ('enableContentMenu' in changes) {
			changeContentMenu(changes.enableContentMenu.newValue);
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

var menu_id = "zdic.net-by-leiqin";

function changeContentMenu(enableContentMenu) {
	if (enableContentMenu) {
		chrome.contextMenus.create({
			id: menu_id,
			title: chrome.i18n.getMessage('menu_title'),
			contexts: ["all"]
		});
	} else {
		chrome.contextMenus.remove(menu_id);
	}
}

function openZdicTab(word) {
	    if (word) {
			chrome.tabs.create({url: "http://www.zdic.net/hans/" + encodeURIComponent(word)});
		} else {
			chrome.tabs.create({url: "http://www.zdic.net/"})
		}
};

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	    if (info.menuItemId !== menu_id) {
			return;
		}
	    var word = info.selectionText;
		openZdicTab(word);
});
