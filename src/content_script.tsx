console.log('content-script.js running');

window.addEventListener('keydown',function(event){
  if (event.shiftKey) {
      chrome.runtime.sendMessage(
        {type: 'shiftPressed'}, 
        response => {
          console.log(response);
        });
      console.log('shiftPressed');
  } else if (event.ctrlKey || event.metaKey) {
    chrome.runtime.sendMessage(
      {type: 'ctrlPressed'}, 
      response => {
        console.log(response);
      });
    console.log('ctrlPressed');
  }
});

window.addEventListener('keyup',function(_){
  chrome.runtime.sendMessage(
    {type: 'keyup'}, 
    response => {
      console.log(response);
    });
  console.log('keyup');
});