(function(){
	let hamburger = document.querySelector('.hamburger');
	let nav = document.querySelector('nav');
	hamburger.onclick = () => {
		console.log('fire');
		if (hamburger.classList.contains('is-active')) {
			hamburger.addEventListener('transitionend', () => {
				document.body.toggleAttribute('menu-active');
			}, {once: true});
			nav.toggleAttribute('reveal');
			hamburger.classList.toggle('is-active');		
		} else {
			document.body.toggleAttribute('menu-active');
			hamburger.addEventListener('transitionend', () => {
				nav.toggleAttribute('reveal');
			}, {once: true});
			hamburger.classList.toggle('is-active');		
		}
	}
	window.onresize = () => {
		if (window.innerWidth >= 1200) {
			if (hamburger.classList.contains('is-active')) {
				hamburger.classList.toggle('is-active');
				nav.toggleAttribute('reveal');
				document.body.toggleAttribute('menu-active');
			}
		}
	}
}());