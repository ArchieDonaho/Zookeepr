const express = require('express');
const { animals } = require('./data/animals.json');
//use the port provided by heroku, or 3001
const PORT = process.env.PORT || 3001;
const app = express();

//takes req.query as an argument and filter through the animals accordingly
function filterByQuery(query, animalsArray){
    //initialize the array for personality traits
    let personalityTraitsArray = [];
    //Note that we save the animalsArray as filteredResults here:
    let filterdResults = animalsArray;

    if(query.personalityTraits){
        //if personalityTraits is a string, place it into a new array and save
        if(typeof query.personalityTraits === 'string'){
            personalityTraitsArray = [query.personalityTraits];
        //else, save personalitTraits as a dedicated array
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //now that personalityTraitsArray is an array containing all traits, loop through each trait in the array...
        personalityTraitsArray.forEach(trait => {
            //...and check the trait against each animal in the filteredResults array.
            //create a new array with each animal containing these traits using .filter()
            filterdResults = filterdResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1)
        })
    }

    if(query.diet){
        filterdResults = filterdResults.filter(animal => animal.diet === query.diet);
    }

    if(query.species){
        filterdResults = filterdResults.filter(animal => animal.species === query.species)
    }

    if(query.name){
        filterdResults = filterdResults.filter(animal => animal.name === query.name)
    }
    
    return filterdResults;
}

//sets up the api endpoint and filters the query
app.get('/api/animals', (req, res) => {
    let results = animals;
    //if a query was entered, filter the animals by that query
    if(req.query){
        results = filterByQuery(req.query, results);
    }

    res.json(results);
})

//host the server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})