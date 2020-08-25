// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

// chrome.runtime.onInstalled.addListener((details) => {
//   console.log('previousVersion', details.previousVersion);
// });

chrome.webRequest.onHeadersReceived.addListener(function(details){
	const headers = details.responseHeaders.filter(e => {
		if (e.name.toLowerCase() == 'content-security-policy') {
			return false;
		} else if (e.name.toLocaleLowerCase() == 'x-frame-options') {
			return false;
		} 
		return true;
	});
	console.log('headers:', headers);
  return {responseHeaders: headers};
}, {urls: ["https://twitter.com/i/timeline", "https://twitter.com/*"]}, ["blocking", "responseHeaders"])

