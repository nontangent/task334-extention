import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/app';
import { AppService } from './app.service';

const appService = AppService.instance;
const appContainer = document.createElement('div');
appContainer.setAttribute('id', 'app-container');

function initializeApp() {
	var trendNode = document.getElementsByTagName('section')[1]?.parentElement?.parentElement?.parentElement;
	var targetNode = trendNode?.parentElement;

	if (trendNode && targetNode) {
		targetNode.insertBefore(appContainer, trendNode);
		ReactDOM.render(<App />, document.querySelector('#app-container'));
	}
	
}

function getHelp(): string {
	const helps: string[] = [
		'@task334 add タスク名',
		'@task334 done タスク番号',
		'@task334 left タスク番号',
		'@task334 devide タスク番号 タスク名 タスク名'
	];
	return helps[Math.floor(Math.random() * helps.length)];
}

setInterval(() => {
	var trendNode = document.evaluate("//span[contains(., 'いまどうしてる')]", document)?.iterateNext();
	if (!document.getElementById('app-container') && trendNode) {
		initializeApp();
	}
}, 500);

setInterval(() => {
	const placeholderNode = document.evaluate("//div[starts-with(@id, 'placeholder') and contains(., 'いまどうしてる')]", document)?.iterateNext();
	if (placeholderNode) {
		placeholderNode.textContent = getHelp();
	}
	
}, 500)

