require('dotenv').config();
const fs = require('fs');
const path = require('path');
const config = require('config');
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
// Retrieve port from configuration
const PORT = config.get('port');

// Create Express application
const app = express();

// Define directory for storing logs
const LOGS_DIRECTORY = path.join(__dirname, 'logs');

// Check if logs directory exists, if not, create it
if (!fs.existsSync(LOGS_DIRECTORY)) {
  fs.mkdirSync(LOGS_DIRECTORY);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(path.join(LOGS_DIRECTORY, 'access.log'), { flags: 'a' });

app.use(cors());

app.set('view engine', 'pug'); // use temlate engine

// these are here, so we don't check JWT and don't parse cookies for staic assets served above
app.use(express.json());
app.use(cookieParser());

// Middleware for logging HTTP requests
app.use(morgan('dev'));
app.use(morgan(':date[iso] :method :url :status', { stream: accessLogStream }));

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
