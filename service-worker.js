'use strict';
// 2019-05-26 09:30
const config = {
	version: location.hostname === 'localhost' ? new Date().toISOString() : '1.0.1',
	stale: [
		'/',
		'/js/index.js',
		'/css/index.css',
		'/img/icons.svg',
		'/img/apple-touch-icon.png',
		'/img/favicon.svg',
		'/js/std-js/deprefixer.js',
		'/js/std-js/shims.js',
		'/js/share-button.js',
		'/js/have-i-been-pwned.js',
		'/js/std-js/functions.js',
		'/js/std-js/asyncDialog.js',
		'/css/vars.css',
		'/css/normalize.css/normalize.css',
		'/css/core-css/rem.css',
		'/css/core-css/viewport.css',
		'/css/core-css/element.css',
		'/css/core-css/class-rules.css',
		'/css/core-css/fonts.css',
		'/css/animate.css/animate.css',
		'/css/core-css/animations.css',
		'/css/layout.css',
		'/js/std-js/Notification.js',
		'/js/std-js/webShareApi.js',
		'/js/std-js/share-config.js',
		'/js/std-js/esQuery.js',
		'/css/core-css/utility.css',
	].map(path => new URL(path, location.origin).href),
};

self.addEventListener('install', async () => {
	const cache = await caches.open(config.version);
	const keys = await caches.keys();
	const old = keys.filter(k => k !== config.version);
	await Promise.all(old.map(key => caches.delete(key)));

	await cache.addAll(config.stale);
	skipWaiting();
});

self.addEventListener('activate', event => {
	event.waitUntil(async function() {
		clients.claim();
	}());
});

self.addEventListener('fetch', async event => {
	async function get(request) {
		const cache = await caches.open(config.version);
		const cached = await cache.match(request);

		return cached instanceof Response ? cached : fetch(request);
	}

	if (event.request.method === 'GET' && config.stale.includes(event.request.url)) {
		event.respondWith(get(event.request));
	}
});
