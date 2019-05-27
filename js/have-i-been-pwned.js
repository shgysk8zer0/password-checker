// GET https://api.pwnedpasswords.com/range/{first 5 hash chars}
const HAVE_I_BEEN_PWNED = 'https://api.pwnedpasswords.com/range/';
const BREACHES = 'https://haveibeenpwned.com/api/v2/breachedaccount/';
import {$} from './std-js/functions.js';

export async function checkPwd(pwd) {
	const hash       = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(pwd))
		.then(buffer => {
			return [...new Uint8Array(buffer)].map(value => {
				const hexCode       = value.toString(16).toUpperCase();
				const paddedHexCode = hexCode.padStart(2, '0');
				return paddedHexCode;
			}).join('');
		});

	const prefix = hash.substring(0, 5);
	const rest   = hash.substring(5);
	const url    = new URL(`./${prefix}`, HAVE_I_BEEN_PWNED);
	const resp   = await fetch(url, {
		method:         'GET',
		headers:        new Headers({Accept: 'application/json'}),
		mode:           'cors',
		referrer:       'no-referrer',
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

export async function checkBreach(email) {
	const url = new URL(`./${encodeURIComponent(email)}`, BREACHES);
	const resp   = await fetch(url, {
		method:         'GET',
		headers:        new Headers({Accept: 'application/json'}),
		mode:           'cors',
		referrer:       'no-referrer',
		referrerPolicy: 'no-referrer',
		credentials:    'omit',
	});
	const breaches = resp.ok ? await resp.json() : [];
	const tpl = document.getElementById('breach-template').content;
	const container = document.getElementById('breaches');
	const items = breaches.map(breach => {
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
	return breaches;
}

window.checkBreach = checkBreach;
