console.log('background.js running');


const targetSite = ['bilibili.com'];
let shiftPressed = false, ctrlPressed = false;

const matchRule = (url) => {
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
      chrome.tabs.remove(tab.id);
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
  }
}); 


async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}