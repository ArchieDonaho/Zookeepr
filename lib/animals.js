const fs = require('fs');
const path = require('path');

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


//takes req.params.id & animals array as an argument and filter through the animals accordingly
function findById(id, animalsArray){
    //return the animal as a single object if the id passed through is the same as that animal's id
    const result = animalsArray.filter(animal => animal.id === id)[0]
    return result;
}

//takes req.body and adds the data to the animals array
function createNewAnimal(body, animalsArray){
    const animal = body;
    //add the new animal to the array
    animalsArray.push(animal);
    //then add the animal to the json file
    fs.writeFileSync(
        path.join(__dirname, '../data/animals.json'),
        //set the animals variable to the animalsArray
        //null states that we dont want to edit any of our existing data.
        //2 indicates the number of space characters to use as white space for indenting purposes; this number is capped at 10
        JSON.stringify({ animals: animalsArray }, null, 2)
    )

    return body;
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};