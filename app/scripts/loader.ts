(async function test() {
	const appShellCaches = await caches.open('app_shell');
	const responses = await appShellCaches.matchAll();

	responses.forEach((response) => {
		const csp = response.headers.get('content-security-policy');
		if (csp) {
			console.debug('content-security-policy is detected. reloding...');
			caches.delete('app_shell');
			document.location.reload();
		} else {
			console.debug('content-security-policy is not detected. success!!');
		}
	})

	fetch('/sw.js').then(async (response) => {
		const csp = response.headers.get('content-security-policy');
		if (csp) {
			console.debug('content-security-policy is detected. updating service worker...');
			(await navigator.serviceWorker.getRegistrations()).forEach((r) => {r.unregister()});
			navigator.serviceWorker.register(`/sw.js?p=${(new Date()).getTime()}`).then((res) => res.update());
		} else {
			(await navigator.serviceWorker.getRegistrations()).forEach((r) => {r.unregister()});
			navigator.serviceWorker.register(`/sw.js?p=${(new Date()).getTime()}`).then((res) => res.update());
			console.debug('content-security-policy is not detected. success!!');
		}
	})
})();

let preBg = null;
setInterval(() => {
	const detectedColor = window.getComputedStyle(document.body).backgroundColor;

	if (detectedColor != preBg) {

		let styles = {
			backgroundColor: 'rgb(245, 248, 250)',
			accentColor: 'rgb(29, 161, 242)',
			color: 'rgb(0, 0, 0)',
			borderBottomColor: 'rgb(230, 236, 240)'
		}
	
		switch (detectedColor) {
			case 'rgb(21, 32, 43)': {
				styles = {
					backgroundColor: 'rgb(25, 39, 52)',
					accentColor: 'rgb(29, 161, 242)',
					color: 'rgb(255, 255, 255)',
					borderBottomColor: 'rgb(56, 68, 77)'
				}
				break;
			}
			default: {
				break;
			}
		}
	
		document.body.style.setProperty('--root-background-color', styles.backgroundColor);
		document.body.style.setProperty('--root-accent-color', styles.accentColor);
		document.body.style.setProperty('--root-color', styles.color);
		document.body.style.setProperty('--root-border-bottom-color', styles.borderBottomColor);
	
		console.debug('bgColor:', detectedColor);
		preBg = detectedColor;
	}

}, 1000);


function injectScript(file: string) {
  const body = document.getElementsByTagName('body')[0];
  const el = document.createElement('script');
  el.setAttribute('type', 'text/javascript');
  el.setAttribute('src', file);
  return body.appendChild(el);
};

function injectStyle(file: string) {
	const body = document.getElementsByTagName('body')[0];
	const el = document.createElement('link');
	el.setAttribute('rel', 'stylesheet');
	el.setAttribute('type', 'text/css');
	el.setAttribute('href', file);
	return body.appendChild(el);
}

injectScript(chrome.extension.getURL('/scripts/app-loader.js'));
injectStyle(chrome.extension.getURL('/styles/style.css'));


