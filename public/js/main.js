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
 * ============================
 *                        =
 * Weather Journal App    =
 *                        =
 * ========================
 */
const weatherCallURL = 'https://api.openweathermap.org/data/2.5/weather?';
let api = '';

const getWeatherAPI = async () => {
	const res = await fetch('/get-weatherapi');

	try {
		// const json = await res.json()
		return await res.json();
	} catch(error) {
		console.log('======ERROR======');
		console.log(error);
	}
};


const getCurrentWeather = async (UseLatLng, coord = {lat: 0, lng: 0}, city, country) => {
	let res = '';
	if (UseLatLng) {
		res = await fetch(`${weatherCallURL}lat=${coord.lat}&lon=${coord.lng}&appid=${api}`)
	} else {
		// THIS NEED TO BE BUILT STILL!
		// res = await fetch(`${weatherCallURL}lat=${coord.lat}&lon=${coord.lng}&appid=${api}`)
	}

	try {
		return await res.json();
	} catch(error) {
		console.log('======ERROR======');
		console.log(error);
	}

}

const requestUserCoords = () => {
	const coords = { lat: 0, lng: 0 };

	navigator.geolocation.getCurrentPosition((pos) => {
		coords.lat = Math.floor(pos.coords.latitude,-1);
		coords.lng = Math.floor(pos.coords.longitude, -1);

	}, (error)=> console.log(error))

	return getCurrentWeather(true, coords);
}


/* THIS WAS MY TEST CODE, RE-WRITE THIS TO FIT PROPER CODE STANDARDS */
navigator.geolocation.getCurrentPosition((pos) => {
    var lat = Math.floor(pos.coords.latitude,-1);
    var lng = Math.floor(pos.coords.longitude, -1);

}, (error)=> console.log(error))


getWeatherAPI().then(res => {
	api = res.api;
	console.log(api);
}).then(() => requestUserCoords())
.then(res => console.log(res))
.catch(res => {
	console.log('Catch an error')
	console.log(res);
})
