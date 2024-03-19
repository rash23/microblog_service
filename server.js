const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const config = require('config');
const cors = require('cors');

const { router: postsRouter } = require('./routes/posts');

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

// Middleware for logging HTTP requests
app.use(morgan('dev'));
app.use(morgan(':date[iso] :method :url :status', { stream: accessLogStream }));

// Middleware for parsing JSON request bodies
app.use(express.json());

app.use('/api/posts', postsRouter);

// Start the server
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
