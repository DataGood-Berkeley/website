(function() {
	const hamburger = document.querySelector('.hamburger');
	const nav = document.querySelector('nav');
	const MIN_WIDTH = 1060;
	hamburger.onclick = () => {
		if (hamburger.classList.contains('is-active')) {
			hamburger.addEventListener('transitionend', () => {
				document.body.toggleAttribute('menu-active');
			}, {
				once: true
			});
			nav.toggleAttribute('reveal');
			hamburger.classList.toggle('is-active');
		} else {
			document.body.toggleAttribute('menu-active');
			hamburger.addEventListener('transitionend', () => {
				nav.toggleAttribute('reveal');
			}, {
				once: true
			});
			hamburger.classList.toggle('is-active');
		}
	};
	window.onresize = () => {
		if (window.innerWidth >= MIN_WIDTH) {
			if (hamburger.classList.contains('is-active')) {
				hamburger.classList.toggle('is-active');
				nav.toggleAttribute('reveal');
				document.body.toggleAttribute('menu-active');
			}
		}
	};
	document.querySelectorAll('[flicker]').forEach(e => {
		const parent = e.parentElement;
		let animation = false;
		parent.addEventListener('mouseover', async () => {
			if (animation) return;
			animation = true;
			for (const e of parent.querySelectorAll('[flicker]')) {
				e.setAttribute('flicker', 'active');
				await new Promise(resolve => {
					e.addEventListener('animationend', () => {
						e.setAttribute('flicker', '');
						resolve();
					}, {
						once: true
					});
				});
			}
			animation = false;
		});
	});
}());
