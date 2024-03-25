const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const config = require('config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { jwtParser } = require('./middleware/auth');

const { router: postsRouter } = require('./routes/posts');
const { router: pageRouter } = require('./routes/pages');
// console.log('postsRouter', postsRouter);

// Retrieve port from configuration
const PORT = config.get('port');

// Define directory for storing logs
const LOGS_DIRECTORY = path.join(__dirname, 'logs');

// Check if logs directory exists, if not, create it
if (!fs.existsSync(LOGS_DIRECTORY)) {
  fs.mkdirSync(LOGS_DIRECTORY);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(path.join(LOGS_DIRECTORY, 'access.log'), { flags: 'a' });

// Create Express application
const app = express();

app.use(cors());

app.use('/public', express.static('static')); // adding the virtual prefix '/public' to static files addresses
app.set('view engine', 'pug'); // use temlate engine

// these are here, so we don't check JWT and don't parse cookies for staic assets served above
app.use(cookieParser()); // so we get convenient _req.cookies_ parsed object
app.use(jwtParser);

// Middleware for logging HTTP requests
app.use(morgan('dev'));
app.use(morgan(':date[iso] :method :url :status', { stream: accessLogStream }));

// Middleware for parsing JSON request bodies
app.use(express.json());

app.use('/api/posts', postsRouter);

// separate routers responsible for pages with templates
app.use('/', pageRouter);

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
