import './std-js/deprefixer.js';
import './std-js/shims.js';
import './share-button.js';
import './have-i-been-pwned-form.js';
import './imgur-img.js';
import './gravatar-img.js';
import {$, ready, registerServiceWorker} from './std-js/functions.js';
import * as dataHandlers from './data-handlers.js';
import * as forms from './forms.js';

document.documentElement.classList.replace('no-js', 'js');
document.body.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}

ready().then(async () => {
	$('[data-scroll-to]').click(dataHandlers.scrollTo);
	$('[data-show-modal]').click(dataHandlers.showModal);
	$('[data-close]').click(dataHandlers.close);
	$('#email-form, #password-form').reset(forms.reset);
	$('#password-form').on('foundpassword', forms.foundPassword);
	$('#email-form').on('foundbreaches', forms.foundBreaches);
});
