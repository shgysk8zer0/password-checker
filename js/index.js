import './std-js/deprefixer.js';
import './std-js/shims.js';
import './share-button.js';
import {checkPwd} from './have-i-been-pwned.js';
import {$, ready, registerServiceWorker} from './std-js/functions.js';
import {alert} from './std-js/asyncDialog.js';

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}

document.documentElement.classList.replace('no-js', 'js');
document.body.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

ready().then(() => {
	$('form').submit(async event => {
		event.preventDefault();

		const form       = new FormData(event.target);
		const matchCount = await checkPwd(form.get('password'));

		alert(`Your password was found ${matchCount} times.`);
	});
});
