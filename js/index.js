import 'https://cdn.kernvalley.us/js/std-js/shims.js';
import 'https://cdn.kernvalley.us/components/notification/html-notification.js';
import 'https://cdn.kernvalley.us/components/share-button.js';
import 'https://cdn.kernvalley.us/components/github/user.js';
import { on, text, attr, toggleClass, animate, ready } from 'https://cdn.kernvalley.us/js/std-js/dom.js';
import { prefersReducedMotion } from 'https://cdn.kernvalley.us/js/std-js/media-queries.js';
import { pwned } from 'https://cdn.kernvalley.us/js/std-js/pwned.js';
import { getCustomElement } from 'https://cdn.kernvalley.us/js/std-js/custom-elements.js';
import { messages } from './consts.js';

toggleClass(document.documentElement, {
	'js': true,
	'no-js': false,
	'no-dialog': document.createElement('dialog') instanceof HTMLUnknownElement,
	'no-details': document.createElement('details') instanceof HTMLUnknownElement,
});

ready().then(async () => {
	on(document.forms.pwned, {
		submit: async event => {
			event.preventDefault();
			attr('button', { disabled: true });
			const data = new FormData(event.target);

			if (await pwned(data.get('password'))) {
				if (! prefersReducedMotion()) {
					animate('#pwned', [{
						transform: 'none',
					}, {
						transform: 'rotate(.005turn)',
					}, {
						transform: 'none'
					}, {
						transform: 'rotate(-.005turn)',
					}], {
						duration: 200,
						easing: 'ease-in-out',
						iterations: 3,
					});
				}

				const HTMLNotification = await getCustomElement('html-notification');
				const notification = new HTMLNotification('Password insecure', {
					body: messages.found,
					tag: 'password-found',
					requireInteraction: true,
					vibrate: [200, 0, 200],
					actions: [{
						title: 'Dismiss',
						action: 'dismiss',
					}, {
						title: 'Reset',
						action: 'reset'
					}]
				});

				notification.addEventListener('notificationclick', ({ target, action }) => {
					switch (action) {
						case 'reset': {
							document.forms.pwned.reset();
							target.close();
							break;
						}
						case 'dismiss': {
							notification.close();
							break;
						}
					}
				})

				text('#result', messages.found);
				toggleClass('#result', { info: false, alert: true, success: false });
			} else {
				text('#result', message.notFound);
				toggleClass('#result', { info: false, alert: false, success: true });
			}

			attr('button', { disabled: false });
		},
		reset: () => {
			attr('button', { disabled: false });
			attr('#password', { type: 'password' });
			text('#password-toggle', 'Reveal password');
			toggleClass('#result', { info: true, success: false, alert: false });
			text('#result', messages.initial);
			document.getElementById('password').focus();
		}
	});

	on('#password-toggle', 'click', () => {
		const input = document.getElementById('password');

		switch (input.type) {
			case 'password':
				attr(input, { type: 'text' });
				text('#password-toggle', 'Hide password');
				break;

			case 'text':
				attr(input, { type: 'password' });
				text('#password-toggle', 'Reveal password');
				break;
		}
	});

	test('#result', messages.initial);
	attr('#pwned', { hidden: false });
});
