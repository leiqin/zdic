browser.browserAction.onClicked.addListener(function(tab) {
	//console.log('browserAction click');
	browser.storage.sync.get({enableSelect: true}).then(function(items) {
		//console.log('browserAction click get option');
		browser.storage.sync.set({enableSelect: !items.enableSelect}).then(function() {
			//console.log('browserAction click set option');
		});
	});
});

browser.storage.sync.get({enableSelect: true, enableContentMenu: true}).then(function(items) {
	setBrowerActionIcon(items.enableSelect);
	changeContentMenu(items.enableContentMenu);
});

browser.storage.onChanged.addListener(function(changes, namespace) {
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
		browser.browserAction.setTitle({title: chrome.i18n.getMessage('disableSelect')});
		browser.browserAction.setIcon({path:{
			'38': 'icon/logo38.png'
		}});
	} else {
		browser.browserAction.setTitle({title: chrome.i18n.getMessage('enableSelect')});
		browser.browserAction.setIcon({path:{
			'38': 'icon/logogray38.png'
		}});
	}
}

var menu_id = "zdic.net-by-leiqin";

function changeContentMenu(enableContentMenu) {
	if (enableContentMenu) {
		browser.contextMenus.create({
			id: menu_id,
			title: chrome.i18n.getMessage('menu_title'),
			contexts: ["all"]
		});
	} else {
		browser.contextMenus.remove(menu_id);
	}
}

function openZdicTab(word) {
	    if (word) {
			browser.tabs.create({url: "http://www.zdic.net/search/?q=" + encodeURIComponent(word)});
		} else {
			browser.tabs.create({url: "http://www.zdic.net/"})
		}
};

browser.contextMenus.create({
	    id: menu_id,
	    title: chrome.i18n.getMessage('menu_title'),
	    contexts: ["all"]
});

browser.contextMenus.onClicked.addListener(function(info, tab) {
	    if (info.menuItemId !== menu_id) {
			return;
		}
	    var word = info.selectionText;
		openZdicTab(word);
});
