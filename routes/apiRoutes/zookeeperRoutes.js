const router = require('express').Router();
const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require('../../lib/zookeepers');
const { zookeepers } = require('../../data/zookeepers.json')

//query search
router.get('/zookeepers', (req, res) => {
    let results = zookeepers;
    if(req.query){
        results = filterByQuery(req.query, results);
    }
    res.json(results);
})

//id search
router.get('/zookeepers/:id', (req, res) => {
    const resilt = findById(req.params.id, zookeepers);
    if(result){
        res.json()
    } else {
        res.send(404);
    }
})

//post
router.post('/zookeepers', (req, res) => {
    req.body.id = zookeepers.length.toString();

    if(!validateZookeeper(req.body)){
        res.status(400).send('The zookeeper is not properly formatted')
    } else {
        const zookeeper = createNewZookeeper(req.body, zookeepers)
        res.json(zookeeper);
    }
})

module.exports = router;