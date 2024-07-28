const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mainRoute = require('./routes/mainRoute');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use('/', mainRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})