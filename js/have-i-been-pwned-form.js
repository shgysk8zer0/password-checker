const HAVE_I_BEEN_PWNED = 'https://api.pwnedpasswords.com/range/';
const BREACHES = 'https://haveibeenpwned.com/api/v2/breachedaccount/';

export default class HTMLHaveIBeenPwnedForm extends HTMLFormElement {
	get mode() {
		return this.getAttribute('mode') || 'password';
	}

	set mode(mode) {
		this.setAttribute('mode', mode);
	}

	get filters() {
		return [...this.querySelectorAll('input[type="checkbox"][name^="filter"][value]:checked')]
			.map(input => input.value);
	}

	async connectedCallback() {
		this.hidden = false;
		this.addEventListener('submit', async event => {
			event.preventDefault();
			const data = new FormData(this);
			switch(this.mode) {
			case 'password':
				this.dispatchEvent(new CustomEvent('foundpassword', {
					detail: {
						found: await this.checkPassword(data.get('password')),
					}
				}));
				break;
			case 'email':
				this.dispatchEvent(new CustomEvent('foundbreaches', {
					detail: {
						found: await this.checkEmail(data.get('email')),
					}
				}));
				break;
			default:
				throw new Error(`Unsupported type: ${this.mode}`);
			}
		});
	}

	async checkPassword(pwd) {
		const hash = await HTMLHaveIBeenPwnedForm.sha(pwd);
		const prefix = hash.substring(0, 5);
		const rest   = hash.substring(5);
		const url    = new URL(`./${prefix}`, HAVE_I_BEEN_PWNED);
		const resp   = await fetch(url, {
			method:         'GET',
			headers:        new Headers({
				Accept: 'application/json',
			}),
			mode:           'cors',
			referrerPolicy: 'no-referrer',
			credentials:    'omit',
		});

		if (resp.ok) {
			const hashes  = await resp.text();
			const matches = hashes.split('\r\n').filter(line => line.startsWith(`${rest}:`));

			return matches.length === 0 ? 0 : parseInt(matches[0].split(':')[1]);
		} else {
			return 0;
		}
	}

	async checkEmail(email) {
		const url = new URL(`./${encodeURIComponent(email)}`, BREACHES);
		const resp   = await fetch(url, {
			method:         'GET',
			headers:        new Headers({
				Accept: 'application/json',
			}),
			mode:           'cors',
			referrer:       'no-referrer',
			referrerPolicy: 'no-referrer',
			credentials:    'omit',
		});
		const filters = this.filters;
		const breaches = resp.ok ? await resp.json() : [];
		if (breaches.length !== 0 && filters.length !== 0) {
			return breaches.filter(breach => filters.every(filter => breach.DataClasses.includes(filter)));
		} else {
			return breaches;
		}
	}

	static async sha(str) {
		const encoder = new TextEncoder().encode(str);
		const buffer = await crypto.subtle.digest('SHA-1', encoder);

		return [...new Uint8Array(buffer)].map(value => {
			const hexCode       = value.toString(16).toUpperCase();
			const paddedHexCode = hexCode.padStart(2, '0');
			return paddedHexCode;
		}).join('');
	}
}

if ('customElements' in window) {
	customElements.define('have-i-been-pwned', HTMLHaveIBeenPwnedForm, {extends: 'form'});
}
