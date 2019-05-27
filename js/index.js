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
		$('.password-found', event.target).remove();
		container.append(tpl);
	});

	$('#password-form').reset(event => $('.password-found', event.target).remove());

	$('#email-form').on('foundbreaches', async event => {
		const tpl = document.getElementById('breach-template').content;
		const container = document.getElementById('breaches');

		if (event.detail.found.length === 0) {
			$(container.children).remove();
			const msg = document.createElement('p');
			msg.classList.add('msg');
			msg.textContent = 'That email address was not found in any breaches.';
			container.append(msg);
		} else {
			const items = event.detail.found.map(breach => {
				const classes = [
					'Verified',
					'Fabricated',
					'Sensitive',
					'Retired',
					'Spamlist',
				]
					.filter(cl => breach[`Is${cl}`] === true)
					.map(cl => `is-${cl.toLowerCase()}`);
				const el = tpl.cloneNode(true);
				$('.breach', el).addClass(...classes);
				const items = breach.DataClasses.map(item => {
					const span = document.createElement('span');
					span.textContent = item;
					span.classList.add('breach-tag');
					return span;
				});

				const date = new Date(breach.BreachDate);
				if (breach.Domain !== '') {
					$('.breach-url', el).attr({href: `https://${breach.Domain}`});
				}
				$('.breach-title', el).text(breach.Title);
				// $('.breach-logo', el).attr({src: breach.LogoPath});
				$('.breach-description', el).html(breach.Description);
				$('.breach-date', el).text(date.toLocaleDateString());
				$('.breach-count', el).text(breach.PwnCount);
				$('.breach-date', el).attr({datetime: date.toISOString()});
				$('.breach-includes', el).append(...items);
				return el;
			});

			$(container.children).remove();

			container.append(...items);
		}
	});

	$('#email-form').reset(event => $('.breach, .msg', event.target).remove());
});
