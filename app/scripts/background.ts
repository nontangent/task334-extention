// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

// chrome.runtime.onInstalled.addListener((details) => {
//   console.log('previousVersion', details.previousVersion);
// });

// chrome.webRequest.onHeadersReceived.addListener((details: any) => {
// 	const headers = details.responseHeaders.filter(e => {
// 		return e.name.toLowerCase() != 'content-security-policy'
// 	});
// 	console.log('headers:', headers);
// }, {
// 	urls: [
// 		'https://twitter.com/*',
// 		'https://twitter.com/i/timeline'
// 	]
// },
// [
// 	'blocking',
// 	'responseHeaders'
// ]);

chrome.webRequest.onHeadersReceived.addListener(function(details){
	const headers = details.responseHeaders.filter(e => e.name.toLowerCase() != 'content-security-policy');
	console.log('headers:', headers);
  return {responseHeaders: headers};
}, {urls: ["https://twitter.com/i/timeline", "https://twitter.com/*"]}, ["blocking", "responseHeaders"])

