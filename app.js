// Local data holder
let projectData = {
	title: 'Weather Journal Data',
	entryCount: 0,
	journals: []
};

const weatherAPI = {
	api: 'ace613c7bf56aa02905bcc207c00efee'
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
const port = 80;


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
	etag: false // Leave false until HTML ready to launch.
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
app.get('/api/get/data', (req, res) => {
	res.send(projectData);
});

app.get('/api/get/journals', (req, res) => {
	res.send(projectData.journals);
});

app.get('/api/get/latest-journal', (req, res) => {
	const lastNum = projectData.journals.length - 1;
	res.send(projectData.journals[lastNum]);
});

app.get('/api/get/entrycount', (req, res) => {
	res.send({ count: projectData.entryCount });
});

app.get('/api/get/weatherapi', (req, res) => {
	console.log('Weather API Sent');
	res.send(weatherAPI);
});

/**
 * POST Functions
 */
app.post('/api/post/entry', (req, res) => {
	console.log(req.body)
	projectData.journals.push(req.body);
	projectData.entryCount = projectData.journals.length;
	res.send({
		response: 'Journal Entry Added',
		numEntries: projectData.entryCount
	});
});

app.post('/api/post/update-entry', (req, res) => {
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
