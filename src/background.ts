// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'

const CONTENT_SECURITY_POLICY = `
connect-src 'self' blob: 
	https://*.giphy.com 
	https://*.pscp.tv 
	https://*.video.pscp.tv 
	https://*.twimg.com 
	https://api.twitter.com https://api-stream.twitter.com 
	https://ads-api.twitter.com https://caps.twitter.com https://media.riffsy.com 
	https://pay.twitter.com https://sentry.io https://ton.twitter.com 
	https://twitter.com https://upload.twitter.com https://www.google-analytics.com 
	https://app.link https://api2.branch.io https://bnc.lt https://vmap.snappytv.com 
	https://vmapstage.snappytv.com https://vmaprel.snappytv.com https://vmap.grabyo.com 
	https://dhdsnappytv-vh.akamaihd.net https://pdhdsnappytv-vh.akamaihd.net 
	https://mdhdsnappytv-vh.akamaihd.net https://mdhdsnappytv-vh.akamaihd.net 
	https://mpdhdsnappytv-vh.akamaihd.net https://mmdhdsnappytv-vh.akamaihd.net 
	https://mdhdsnappytv-vh.akamaihd.net https://mpdhdsnappytv-vh.akamaihd.net 
	https://mmdhdsnappytv-vh.akamaihd.net https://dwo3ckksxlb0v.cloudfront.net
	https://*.googleapis.com ; 
default-src 'self'; 
form-action 'self' 
	https://twitter.com https://*.twitter.com; 
font-src 'self' 
	https://*.twimg.com; 
frame-src 'self' 
	https://twitter.com https://mobile.twitter.com 
	https://pay.twitter.com https://cards-frame.twitter.com
	https://task334-c700c.firebaseapp.com ; 
img-src 'self' blob: data: 
	https://*.cdn.twitter.com https://ton.twitter.com 
	https://*.twimg.com https://analytics.twitter.com https://cm.g.doubleclick.net 
	https://www.google-analytics.com https://www.periscope.tv https://www.pscp.tv 
	https://media.riffsy.com https://*.giphy.com https://*.pscp.tv; 
manifest-src 'self'; 
media-src 'self' blob: https://twitter.com https://*.twimg.com https://*.vine.co 
	https://*.pscp.tv https://*.video.pscp.tv https://*.giphy.com https://media.riffsy.com 
	https://dhdsnappytv-vh.akamaihd.net https://pdhdsnappytv-vh.akamaihd.net 
	https://mdhdsnappytv-vh.akamaihd.net https://mdhdsnappytv-vh.akamaihd.net 
	https://mpdhdsnappytv-vh.akamaihd.net https://mmdhdsnappytv-vh.akamaihd.net 
	https://mdhdsnappytv-vh.akamaihd.net https://mpdhdsnappytv-vh.akamaihd.net 
	https://mmdhdsnappytv-vh.akamaihd.net https://dwo3ckksxlb0v.cloudfront.net; 
object-src 'none'; 
script-src 'self' 'unsafe-inline' 
	https://*.twimg.com   
	https://www.google-analytics.com https://twitter.com https://app.link  
	'nonce-NTkzY2NkMWItZDQ5OC00M2MxLThiNWYtYWZmOGVhZWEzMDZl'; 
style-src 'self' 'unsafe-inline' 
	https://*.twimg.com; 
worker-src 'self' blob:; 
report-uri https://twitter.com/i/csp_report?a=O5RXE%3D%3D%3D&ro=false
`.replace(/\r?\n/g,'').replace('\t','');;


chrome.webRequest.onHeadersReceived.addListener(function(details){
	console.debug('blocked', details.url);
	const targets = ['content-security-policy', 'x-frame-options'];
	const headers = details.responseHeaders.filter(e => {
		return !targets.includes(e.name.toLowerCase());
	});

	console.debug('headers:', headers);
  return {responseHeaders: headers};
}, {urls: ["<all_urls>"]}, ["blocking", "responseHeaders"])
