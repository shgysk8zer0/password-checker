import './std-js/deprefixer.js';
import './std-js/shims.js';
import {checkPwd} from './have-i-been-pwned.js';
import {$, ready} from './std-js/functions.js';
import {alert} from './std-js/asyncDialog.js';

ready().then(() => {
	$('form').submit(async event => {
		event.preventDefault();

		const form       = new FormData(event.target);
		const matchCount = await checkPwd(form.get('password'));

		alert(`Your password was found ${matchCount} times.`);
	});
});

document.documentElement.classList.replace('no-js', 'js');
document.body.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);
