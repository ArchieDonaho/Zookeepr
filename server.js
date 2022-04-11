const express = require('express');
const fs = require('fs');
const path = require('path');

const { animals } = require('./data/animals.json');

//use the port provided by heroku (80), or 3001 for local testing
const PORT = process.env.PORT || 3001;
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON data
app.use(express.json());

//takes req.params.id & animals array as an argument and filter through the animals accordingly
function findById(id, animalsArray){
    //return the animal as a single object if the id passed through is the same as that animal's id
    const result = animalsArray.filter(animal => animal.id === id)[0]
    return result;
}

//checks the newly added animal to ensure the name, species, diet, and personality are all valid
function validateAnimal(animal){
    if(!animal.name || typeof animal.name !== 'string'){
        return false;
    }
    if(!animal.species || typeof animal.species !== 'string'){
        return false;
    }
    if(!animal.diet || typeof animal.diet !== 'string'){
        return false;
    }
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits)){
        return false;
    }
    return true;
}

//takes req.body and adds the data to the animals array
function createNewAnimal(body, animalsArray){
    const animal = body;
    //add the new animal to the array
    animalsArray.push(animal);
    //then add the animal to the json file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        //set the animals variable to the animalsArray
        //null states that we dont want to edit any of our existing data.
        //2 indicates the number of space characters to use as white space for indenting purposes; this number is capped at 10
        JSON.stringify({ animals: animalsArray }, null, 2)
    )

    return body;
}

//takes req.query & animals array as an argument and filter through the animals accordingly
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

//sets up an api endpoint for query search, returns multiple animals
app.get('/api/animals', (req, res) => {
    let results = animals;
    //if a query was entered, filter the animals by that query
    if(req.query){
        results = filterByQuery(req.query, results);
    }

    res.json(results);
})

//sets up an api endpoint for parameter search, returns one animal
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else {
        //send error if the parameter is nonexistent
        res.sendStatus(404);
    }

})

//sets up enpoint to allow users to add animals to the json file
app.post('/api/animals', (req, res) => {
    //req.body contains the incoming content
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    //if any data in req.body is incorrect, sent 400 error back
    if(!validateAnimal(req.body)){
        res.status(400).send('The animal is not properly formatted');
    } else {
        //add animal to json file and animals array
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
})

//host the server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
})