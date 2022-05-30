let shiftPressed = false, ctrlPressed = false;

/**
 * @interface Rules
 * @member {string[]} redirectionRules - site we want to redirect to instead of new tab
 * @member {string[]} newTabRules - site we want to open in new tab instead of redirect
 */
interface Rules {
	redirectionRules: string[] 
	newTabRules: string[];
}

let rulesCache: Rules = {
	redirectionRules: [],
	newTabRules: []
};

listenOnTabs();

function listenOnTabs() {
	listenForMessage();
	handleNewTab();
	handleRedirection();
}

function listenForMessage() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		switch(request.type){
		case 'shiftPressed':
			shiftPressed = true;
			break;
		case 'ctrlPressed':
			ctrlPressed = true;
			break;
		case 'keyup':
			shiftPressed = false;
			ctrlPressed = false;
			break;
		case 'getCurrentRule':
			// get current rule from storage and send it back
			getRulesFromStorage().then(
				rules => {
					rulesCache = rules;
					// TODO: handle both type of rules
					sendResponse(rules.redirectionRules);
				}
			);
			return true;
		case 'updateRule':
			getRulesFromStorage().then(
				storage => {
					// TODO: handle both type of rules
					const newRules = request.newRules;
					rulesCache = {
						redirectionRules: newRules,
						newTabRules: storage.newTabRules
					};
					chrome.storage.sync.set(
						{
							'redirectionRules': rulesCache.redirectionRules,
							'newTabRules': rulesCache.newTabRules
						}, 
						() => {
						console.log('updated redirection rule to', request.newRules);
					});
					sendResponse(rulesCache.redirectionRules);
				}
			);
			return true;
		}
	}); 
}


function handleNewTab() {
	chrome.tabs.onCreated.addListener(
		async (tab) => {
			const newPage = await getCurrentTab();
			const url = newPage.pendingUrl;
			const isMatched = await matchRule(url);
			if (isMatched && !shiftPressed && !ctrlPressed) {
				chrome.tabs.remove(tab.id as number);
				chrome.tabs.update({url: url});
			}
		});
}

async function getCurrentTab() {
	const queryOptions = { active: true, lastFocusedWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

async function matchRule(url: string | undefined) {
	if (!url) {
		return false;
	} 
	const rules = await getRulesFromStorage();
	rulesCache = rules;
	console.log(rulesCache);
	for (const target of rulesCache.redirectionRules) {
		if (url.includes(target)) {
			return true;
		}
	}
	return false;
};

function handleRedirection() {
	// TODO
}


function getRulesFromStorage(): Promise<Rules> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (storage) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
			const rulesObj:Rules = {
				redirectionRules: storage.redirectionRules,
				newTabRules: storage.newTabRules
			}
      resolve(rulesObj);
    });
  });
}
