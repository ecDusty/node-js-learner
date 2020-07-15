// Local data holder
let projectData = {
	title: 'Testing',
	postCount: 0,
	animals: []
};

// Base functions
const say = text => console.log(text);

// Server
const express = require('express');
const port = 3030

// Dependancies
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express
const app = express();

const listening = () => {
	console.log('Server is purring');
	console.log(`Running on localhost: ${port}`);
};

// Startup body parser dependency
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup CORS policy
app.use(cors());

// Setup main project folder
app.use(express.static('app'));

// Startup Server
const server = app.listen(port, listening);

// respond with "hello world" when a GET request is made to the homepage
app.get('/test', function (req, res) {
	console.log('===Request Received===');
	console.log(req.query);
	console.log('=== end request ===');
	res.send(projectData);
})

app.post('/test', (req, res) => {
	projectData.postCount++;
	res.send('Post received!');
});

app.post('/add/animals', (req, res) => {

	projectData.animals.push(req.body);
	console.log(req.body);
	res.send('Post received!');
});

const data = [];

app.post('/animal', addAnimal);

function addAnimal (req, res) {
	data.push(req.body);
	say(data);
	res.send({
		res: 'Post received!'
	});
}
