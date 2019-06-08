export function scrollTo(event) {
	const target = document.querySelector(event.target.closest('[data-scroll-to]').dataset.scrollTo);
	target.scrollIntoView({
		bahavior: 'smooth',
		block: 'start',
	});
}

export function showModal(event) {
	const target = document.querySelector(event.target.closest('[data-show-modal]').dataset.showModal);
	if (target instanceof HTMLElement) {
		target.showModal();
	}
}

export function close(event) {
	const target = document.querySelector(event.target.closest('[data-close]').dataset.close);
	if (target instanceof HTMLElement) {
		target.close();
	}
}
