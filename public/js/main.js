const redirectHomePageOnError = () => {
	const toggler = document.querySelector('.js-toggle-redirect-homepage');
	if (toggler) {
		setTimeout(() => window.location.pathname = '/', 5000);
	}
}

redirectHomePageOnError();
