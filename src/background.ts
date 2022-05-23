const targetSite = ['bilibili.com'];
let shiftPressed = false, ctrlPressed = false;

const matchRule = (url: String | undefined) => {
  if (!url) return false;
  for (const target of targetSite) {
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
    if (matchRule(url) && !shiftPressed) {
      chrome.tabs.remove(tab.id as number);
      chrome.tabs.update({url: url});
    }
});

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
          sendResponse(targetSite);
        break;
      case 'addNewSite':
          addNewSite(request.site);
          sendResponse(targetSite);
          break;
  }
}); 


async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
const addNewSite = (site: string) => {
  targetSite.push(site);
}