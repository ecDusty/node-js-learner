// Local data holder
let projectData = {
	title: 'Weather Journal Data',
	entryCount: 0,
	journals: []
};

// Dependancies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const createError = require('http-errors');
const path = require('path');
// const cookieParser = require('cookie-parser'); // Still have no idea what this is for
const logger = require('morgan');

// HTML Page loaders
const indexRouter = require('./routes/index');


// Initialize Express
const app = express();

/**
 *  Setup port
 */
const port = 8080;


/**
 * Start up the view engine
 * This is powered by PUG
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Startup the nice console logger
app.use(logger('dev'));

// Startup body parser dependency
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Startup Cookie Parser (Not sure about this one yet)
// app.use(cookieParser());

// Setup CORS policy
app.use(cors());

// Setup main project folder
app.use(express.static(path.join(__dirname, 'public') || 'public', {
	etag: true
  }));

// Setup HTML page loads on http request
app.use('/', indexRouter);

/**
 * ======================
 * API Build Section    =
 * ======================
 */

/**
 * GET Functions
 */
app.get('/get-data', (req, res) => {
	res.send(projectData);
});

app.get('/get-journals', (req, res) => {
	res.send(projectData.journals);
});

app.get('/get-entrycount', (req, res) => {
	res.send({ count: projectData.entryCount });
});

/**
 * POST Functions
 */
app.post('/post-entry', (req, res) => {
	projectData.push(req.body);
	projectData.entryCount = projectData.journals.length;
	res.send({
		response: 'Journal Entry Added',
		numEntries: projectData.entryCount
	});
});

app.post('/post-update-entry', (req, res) => {
	res.send({
		response: 'This function is not built yet'
	})
});

// END OF API ==============================================



// Catch 404 and forward to error handler
//* this catcher was copied by the myExpressApp example
app.use((req, res, next) => {
	next(createError(404));
});

// Error Handler
//* this handler was copied by the myExpressApp example
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


// Export the app
module.exports = app;

/**
 * This is old code I wrote that I'm holding on to for now
 * as it's a great example resource.
 *
 */

// // respond with "hello world" when a GET request is made to the homepage
// app.get('/test', function (req, res) {
// 	console.log('===Request Received===');
// 	console.log(req.query);
// 	console.log('=== end request ===');
// 	res.send(projectData);
// })

// app.post('/test', (req, res) => {
// 	projectData.postCount++;
// 	res.send('Post received!');
// });

// app.post('/add/animals', (req, res) => {

// 	projectData.animals.push(req.body);
// 	console.log(req.body);
// 	res.send('Post received!');
// });

// const data = [];

// app.post('/animal', addAnimal);

// function addAnimal (req, res) {
// 	data.push(req.body);
// 	say(data);
// 	res.send({
// 		res: 'Post received!'
// 	});
// }
