/**
 * Check if on an error page
 */
const redirectHomePageOnError = () => {
	const toggler = document.querySelector('.js-toggle-redirect-homepage');
	if (toggler) {
		setTimeout(() => window.location.pathname = '/', 5000);
	}
}

redirectHomePageOnError();

/**
 * Watch Inputs on forms,
 * When they are filled, apply class '.js--filled'
 */
const forms = [...document.querySelectorAll('.form')];

const checkInput = (input) => {
	let inputRequiredMissing = false;
	if (input.attributes.required && (input.value === '' || (input.type === 'checkbox' && !input.checked))) {
		inputRequiredMissing = true;
	} else if (input.type === 'email') {
		const parts = input.value.split('@');
		const partTwo = parts[1] ? parts[1].split('.') : false;

		inputRequiredMissing = !(parts.length === 2);
		inputRequiredMissing = !(partTwo && !inputRequiredMissing ? partTwo.length >= 2 : false);
		inputRequiredMissing = !(partTwo && !inputRequiredMissing ? partTwo[1].length >= 2 : false);
	}

	if (inputRequiredMissing) input.classList.add('js--input-error');
	else input.classList.remove('js--input-error');

	return inputRequiredMissing;
}

const checkForm = (form) => {
	const inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('textarea')];
	inputs.forEach((input) => {
		input.addEventListener('input', () => {
			if (input.value !== '' && !input.classList.contains('js--filled')) {
				input.classList.add('js--filled');
			} else if (input.value === '' && input.classList.contains('js--filled')) {
				input.classList.remove('js--filled');
			}
		});
	});

	inputs.forEach((input) => {
		input.addEventListener('focusout', () => checkInput(input));
	});
};

/* ====== END OF FORM input functionality ====== */

/**
 * ============================
 *                        =
 * Weather Journal App    =
 *                        =
 * ========================
 */
const jForm = document.querySelector('.js-create-journal-form');
const jDate = document.querySelector('#jDate');
const jTitle = document.querySelector('#jTitle');
const jLat = document.querySelector('#jLat');
const jLong = document.querySelector('#jLng');
const jCity = document.querySelector('#jCity');
const jCountry = document.querySelector('#jCountry');
const jTemp = document.querySelector('#jTemp');
const jHumid = document.querySelector('#jHumid');
const jList = document.querySelector('.js-journal-entry-list');

const btnEntry = document.querySelector('.js-save-entry');
const btnWeather = document.querySelector('.js-update-weather');

const weatherCallURL = 'https://api.openweathermap.org/data/2.5/weather?';
let api = '';
let useLatLong = false;

const getWeatherAPI = async () => {
	const res = await fetch('/api/get/weatherapi');

	try {
		// const json = await res.json()
		return await res.json();
	} catch(error) {
		activateCityCountry();
		console.log('======ERROR======');
		console.log(error);
	}
};

const activateCityCountry = () => {
	jCity.disabled = false;
	jCountry.disabled = false;
}

const setCurrentWeather = (temp, humid) => {
	jTemp.classList.add('js--filled');
	jHumid.classList.add('js--filled');

	jTemp.value = temp;
	jHumid.value = humid;
}

const setCurrCoords = (coords) => {
	useLatLong = true;
	jLat.value = coords.lat;
	jLong.value = coords.lng;

	jLat.classList.add('js--filled');
	jLong.classList.add('js--filled');
}

const setCurrDate = () => {
	const date = new Date();
	jDate.value = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
	jDate.classList.add('js--filled');
}


const getCurrentWeather = async (coord = {lat: 0, lng: 0}, city, country) => {
	let res = '';
	if (useLatLong) {
		// Search using Lat & Long coordinates
		res = await fetch(`${weatherCallURL}lat=${coord.lat}&lon=${coord.lng}&appid=${api}`)
	} else {
		// Search using City and Country name
		res = await fetch(`${weatherCallURL}q=${city},${country}&appid=${api}`)
	}

	try {
		return await res.json();
	} catch(error) {
		console.log('======ERROR======');
		console.log(error);
	}
}

const requestUserCoords = () => {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
}

const createJournalEl = (title, date, coords, temp, humid, city, country) => {
	const template = `<div class="Journal__ListItem p-4 mb-3" style="border: 1px solid gray;">
		<h4>${title}</h4>
		<h5><sup>${date}</sup></h5>
		<p><b>Temperature:</b> ${temp}  |  <b>Humidity:</b> ${humid}</p>
		${city ? `<p>${city}, ${country}</p>` : `Latitude: ${coords.lat}, Longitute: ${coords.lng}`}
	<div>`
	return template;
}

const addToJournalList = (title, date, coords, city, country, temp, humid) => {
	jList.insertAdjacentHTML(
		'beforeend',
		createJournalEl(title, date, coords, temp, humid, city, country)
	);
};

const getCurrJournalEntries = async () => {
	const res = await fetch('/api/get/journals')

	try {
		return res.json();
	} catch(error) {
		console.log('===== Error pulling all Journal entries =====');
		console.log(error);
	}
}

const getLatestJournalEntry = async () => {
	const res = await fetch('/api/get/latest-journal');

	try {
		return res.json();
	} catch(error) {
		console.log('===== Error getting lates journal entry =====');
		console.log(error);
	}
}

const postJournalEntry = async (journal) => {
	const res = await fetch('/api/post/entry', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(journal)
	});

	try {
		return res.json();
	} catch(error) {
		console.log('===== Error posting journal entry =====');
		console.log(error);
	}
}

if (jForm) {
	setCurrDate();
	checkForm(jForm);


	// Start the initial weather check process
	// - check if you can get coordinates from the user
	// - then pull weather information automatically with coordinates
	getWeatherAPI().then(res => {
		api = res.api;
		console.log(api);
	}).catch(error => {
		console.log('==== Failed to get API key, continue with get coords =====')
		return requestUserCoords();
	}).then(() => requestUserCoords())
	.catch(error => {
		console.log('====Error with Coords====');
		console.log(error);
	})
	.then((res) => {
		const coords = {
			lat: res.coords.latitude,
			lng: res.coords.longitude
		}
		setCurrCoords(coords)
		return getCurrentWeather(coords)
	})
	.then(res => {
		const temp = `${Math.floor(res.main.temp - 273.14, -1)}ºC`;
		const humid = `${res.main.humidity}%`;
		setCurrentWeather(temp, humid);
		activateCityCountry();
	}).catch(res => {
		console.log('Catch an error')
		console.log(res);
	});

	getCurrJournalEntries().then(res => {
		addToJournalList(res.title, res.date, res.coords, res.city, res.country, res.temp, res.humid);
	})

	btnEntry.addEventListener('click', (e) => {
		e.preventDefault();
		let inputsCheck = false;

		if (jTitle.value === '') {
			inputsCheck = true;
			jTitle.classList.add('js--input-error');
		} else { jTitle.classList.remove('js--input-error'); }

		if (jTemp.value === '') {
			inputsCheck = true;
			jTemp.classList.add('js--input-error');
		} else { jTemp.classList.remove('js--input-error'); }

		if (jHumid.value === '') {
			inputsCheck = true;
			jHumid.classList.add('js--input-error');
		} else { jHumid.classList.remove('js--input.error'); }

		if (!inputsCheck) {
			const journal = {
				title: jTitle.value,
				date: jDate.value,
				coords: {
					lat: jLat.value,
					lng: jLong.value
				},
				city: jCity.value === '' ? false : jCity.Value,
				country:  jCountry.value === '' ? false : jCountry.Value,
				temp: jTemp.value,
				humid: jHumid.value
			}

			postJournalEntry(journal)
			.then(res => {
				console.log(res);
				return getLatestJournalEntry();
			}).then(res => {
				addToJournalList(res.title, res.date, res.coords, res.city, res.country, res.temp, res.humid);
			})
		}
	});

	btnWeather.addEventListener('click', (e) => {
		e.preventDefault();

		if (jCity.value !== '' && jCountry !== '') {
			useLatLong = false;
		}

		getCurrentWeather({ lat: jLat.value, lng: jLong.value }, jCity.value, jCountry.value)
		.then(res => {
			const temp = `${Math.floor(res.main.temp - 273.14, -1)}ºC`;
			const humid = `${res.main.humidity}%`;
			setCurrentWeather(temp, humid);
		})
	});

	jForm.addEventListener('submit', e => e.preventDefault());
}
