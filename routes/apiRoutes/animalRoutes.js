const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

//sets up an api endpoint for query search, returns multiple animals
router.get('/animals', (req, res) => {
    let results = animals;
    //if a query was entered, filter the animals by that query
    if(req.query){
        results = filterByQuery(req.query, results);
    }

    res.json(results);
})

//sets up an api endpoint for parameter search, returns one animal
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result){
        res.json(result);
    } else {
        //send error if the parameter is nonexistent
        res.send(404);
    }

})

//sets up enpoint to allow users to add animals to the json file
router.post('/animals', (req, res) => {
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

//exports to apiRoutes/index.js
module.exports = router;