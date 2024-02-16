
require('dotenv').config()
const express = require("express");
const morgan = require('morgan');
const fs = require('fs')
const app = express();
var accessLogStream = fs.createWriteStream((__dirname, 'notes.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))
const port = process.env.PORT || 8080;
require("./src/DatabaseConnections/DatabaseConnectins")
const registrationsRoute = require("./src/Router/registrationsRoute");
const loginRoute = require("./src/Router/loginRoute");
const bcrypt = require('bcryptjs');
app.use(express.json());
app.use(morgan('combined'))
app.use(registrationsRoute); 
app.use(loginRoute); 

app.listen(port, () => console.log(`Application Listening On Port ${port}!`));