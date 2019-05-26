import './std-js/deprefixer.js';
import './std-js/shims.js';
import './share-button.js';
import {$, ready, registerServiceWorker} from './std-js/functions.js';
import './have-i-been-pwned-form.js';

if (document.documentElement.dataset.hasOwnProperty('serviceWorker')) {
	registerServiceWorker(document.documentElement.dataset.serviceWorker).catch(console.error);
}

document.documentElement.classList.replace('no-js', 'js');
document.body.classList.toggle('no-dialog', document.createElement('dialog') instanceof HTMLUnknownElement);

ready().then(() => {
	$('[data-scroll-to]').click(event => {
		const target = document.querySelector(event.target.closest('[data-scroll-to]').dataset.scrollTo);
		target.scrollIntoView({
			bahavior: 'smooth',
			block: 'start',
		});
	});
	$('#password-form').on('foundpassword', async event => {
		const tpl = document.getElementById('password-found-template').content.cloneNode(true);
		const container = document.getElementById('password-found-results');
		$('.found', tpl).text(event.detail.found);
		$('#password-form .password-found').remove();
		container.append(tpl);
	});

	$('#password-form').reset(() => $('#password-form .password-found').remove());

	$('#email-form').on('foundbreaches', async event => {
		const tpl = document.getElementById('breach-template').content;
		const container = document.getElementById('breaches');
		console.log(event.detail.found);
		const items = event.detail.found.map(breach => {
			const el = tpl.cloneNode(true);
			const date = new Date(breach.BreachDate);
			$('.breach-title', el).text(breach.Title);
			$('.breach-url', el).attr({href: `https://${breach.Domain}`});
			// $('.breach-logo', el).attr({src: breach.LogoPath});
			$('.breach-description', el).html(breach.Description);
			$('.breach-date', el).text(date.toLocaleDateString());
			$('.breach-date', el).attr({datetime: date.toISOString()});
			return el;
		});

		[...container.children].forEach(child => child.remove());

		container.append(...items);
	});

	$('#email-form').reset(() => $('#email-form .breach').remove());
});
