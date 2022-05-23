let shiftPressed = false, ctrlPressed = false;

// Where we will expose all the data we retrieve from storage.sync.
let rulesCache: string[] = [];

const updateRulesCache = getRulesFromStorage().then(rules => {
  rulesCache = rules;
	return rulesCache;
});

const matchRule = async (url: string | undefined) => {
	if (!url) {
		return false;
	} 
  // get all rules from chrome storage
	await updateRulesCache;
	for (const target of rulesCache) {
		if (url.includes(target)) {
			return true;
		}
	}
	return false;
};

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

async function getCurrentTab() {
	const queryOptions = { active: true, lastFocusedWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

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
		break;
	case 'getCurrentRule':
		// get current rule from storage and send it back
		getRulesFromStorage().then(
			rules => {
				sendResponse(rules);
			}
		);
		return true;
	case 'addNewSite':
		getRulesFromStorage().then(
			rules => {
				rules.push(request.site);
				rulesCache = rules;
				chrome.storage.sync.set({'rules': rulesCache}, () => {
					console.log('added new rule', request.site);
				});
				sendResponse(rulesCache);
			}
		);
		return true;
  }
}); 

function getRulesFromStorage(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({'rules':[]}, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items.rules);
    });
  });
}
