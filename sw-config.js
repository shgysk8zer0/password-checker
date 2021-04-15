/* eslint-env serviceworker */
/* eslint no-unused-vars: 0 */
/* 2021-02-11T18:09 */

const config = {
	version: '2.0.0',
	fresh: [
		'/manifest.json',
	].map(path => new URL(path, location.origin).href),
	stale: [
		/* HTML */
		'/',

		/* JavaScript */
		'/js/index.min.js',

		/* Styles */
		'/css/index.min.css',
		'https://cdn.kernvalley.us/components/github/user.css',
		'https://cdn.kernvalley.us/components/install/prompt.css',

		/* Images */
		'/img/icons.svg',
		'/img/apple-touch-icon.png',
		'/img/icon-192.png',
		'/img/icon-32.png',
		'/img/favicon.svg',

		/* HTML / Templates */
		'https://cdn.kernvalley.us/components/github/user.html',
		'https://cdn.kernvalley.us/components/install/prompt.html',
		'https://cdn.kernvalley.us/img/logos/pwa-badge.svg',
		'https://cdn.kernvalley.us/img/logos/instagram.svg',

		/* Fonts */
		'https://cdn.kernvalley.us/fonts/roboto.woff2',

		/* Other */
	].map(path => new URL(path, location.origin).href),
	allowed: [
		'https://i.imgur.com/',
		/https:\/\/\w+\.githubusercontent\.com\/u\/*/,
	],
	allowedFresh: [
		'https://api.github.com/user/',
		/\.(png|jpg|gif|js|css|html|svg|json)$/,
	],
};
