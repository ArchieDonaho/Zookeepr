const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(require('./zookeeperRoutes'));
//use the module exported from animalRoutes and employ router
router.use(animalRoutes);


module.exports = router;