var options = {
	enableSelect: true,
	enableCtrlHover: false,
	ctrlHoverKey: "Alt"
};

chrome.storage.sync.get(options, function(items) {
	//console.log('storage get');
	options = items;
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	//console.log('storage change');
	if (namespace == 'sync') {
		for (key in changes) {
			options[key] = changes[key].newValue;
		}
	}
});

function click_handler(event) {
	//console.log('click_handler');
	if (zdic_layer_mouseover) {
		return;
	}
	if (!zl().hidden) {
		hidden_zdic_layer();
		return;
	}
	if (!options.enableSelect) {
		return;
	}
	lookup(event);
}

document.addEventListener("click", click_handler, true);

function keydown_handler(event) {
	//console.log('keydown_handler');
	if (!zl().hidden) {
		hidden_zdic_layer();
		return;
	}

	var isToLookup = false;

	if (!options.enableCtrlHover) 
		return;

	switch (options.ctrlHoverKey) {
		case "Shift":
			if ((KeyEvent.DOM_VK_CONTROL == event.keyCode &&
						event.shiftKey && !event.altKey && !event.metaKey)
					|| (KeyEvent.DOM_VK_SHIFT == event.keyCode &&
						event.ctrlKey && !event.altKey && !event.metaKey)) {
				isToLookup = true;
			}
			break;
		case "Alt":
			if ((KeyEvent.DOM_VK_CONTROL == event.keyCode &&
						!event.shiftKey && event.altKey && !event.metaKey)
					|| (KeyEvent.DOM_VK_ALT == event.keyCode &&
						event.ctrlKey && !event.shiftKey && !event.metaKey)) {
				isToLookup = true;
			}
			break;
		default:
			if (KeyEvent.DOM_VK_CONTROL == event.keyCode &&
					!event.shiftKey && !event.altKey && !event.metaKey) {
				isToLookup = true;
			}
	}

	if (isToLookup) {
		lookup(event);
	} else {
		hidden_zdic_layer();
	}
}

document.addEventListener("keydown", keydown_handler, true);

var zdic_layer_ui;
var zdic_layer_mouseover = false;

function zdic_layer_over() {
	//console.log('zdic_layer_over');
	zdic_layer_mouseover = true;
}

function zdic_layer_out() {
	//console.log('zdic_layer_out');
	zdic_layer_mouseover = false;
}

function init_zidc_layer_ui() {
	var div = document.createElement('div');
	div.setAttribute('id', 'zdic-layer-leiqin.info');
	div.setAttribute('style', 'position: fixed; top: 0; left: 0; z-index: 10000;');
	div.style.width = '244px';
	div.style.height = '300px';
	div.style.border = '2px solid gray';
	div.style.background = 'white';
	div.style.display = 'none';
	div.addEventListener('mouseover', zdic_layer_over);
	div.addEventListener('mouseout', zdic_layer_out);
	var p = document.createElement('p');
	p.innerText = "查询中...";
	div.appendChild(p);
	p = document.createElement('p');
	p.setAttribute('style', 'text-align: center;text-indent: 0;padding: 1em;')
		div.appendChild(p);

	var iframe = create_iframe();
	div.appendChild(iframe);

	document.body.appendChild(div);
	zdic_layer_ui = {
		div: div,
		iframe: iframe,
		p: p,
		hidden: true
	};
	return zdic_layer_ui;
}

function hidden_zdic_layer() {
	zl().div.style.display = 'none';
	zl().hidden = true;
}

function create_iframe() {
	var iframe = document.createElement('iframe');
	iframe.setAttribute("style", "position: absolute; top: 0; left: 0;width: 100%; height: 100%; border: none");
	return iframe;
}

function zl() {
	if (!zdic_layer_ui)
		init_zidc_layer_ui();
	return zdic_layer_ui;
}

function lookup(event) {
	if (zdic_layer_mouseover) {
		return;
	}
	var sel = document.getSelection();
	if (sel) {
		word = sel.toString().trim();
	}
	//console.log('lookup word <' + word + '>');
	if (word) {
		zl().div.removeChild(zl().iframe);
		zl().iframe = create_iframe();
		zl().div.appendChild(zl().iframe);
		zl().p.innerText = word;

		r = sel.getRangeAt(0);
		rect = r.getBoundingClientRect();
		zl().div.style.top = rect.bottom + 10 + 'px';
		zl().div.style.left = rect.right + 'px';
		zl().div.style.display = 'block';
		zl().hidden = false;

		//console.log('url ' + search_url(word));
		zl().iframe.src = search_url(word);
	} else {
		hidden_zdic_layer();
	}
}

function search_url(word) {
	return "//www.zdic.net/search/?c=3&q=" + encodeURIComponent(word);
}

if (typeof KeyEvent == "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}
