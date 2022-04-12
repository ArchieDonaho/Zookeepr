const express = require('express');
// const fs = require('fs');
// const path = require('path');

//get the index.js files from the routing folders
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes')

// const { animals } = require('./data/animals.json');

//middleware
//use the port provided by heroku (80), or 3001 for local testing
const PORT = process.env.PORT || 3001;
const app = express();

//allows files in the public folder to be static resources and able to be accessed w/o server endpoints
//NEEDS TO COME BEFORE app.use('/'...) REFFERING TO THE HTML PAGES
app.use(express.static('public'));

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//if the user navigates to /api endpoint, the ap will use the router set up in apiRoutes
app.use('/api', apiRoutes);
//if the user is at the / endpoint, the router will serve back our html routes
app.use('/', htmlRoutes);

//host the server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})