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


