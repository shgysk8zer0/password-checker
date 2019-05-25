// GET https://api.pwnedpasswords.com/range/{first 5 hash chars}
const HAVE_I_BEEN_PWNED = 'https://api.pwnedpasswords.com/range/';

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
