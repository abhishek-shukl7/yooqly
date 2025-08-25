const express = require("express");
const router = express.Router();
const { query } = require('express-validator');
const mapController = require('../controllers/mapController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/getCoordinates', 
    query('address').isString().isLength({min : 3}),
    authMiddleware.checkUser,
    mapController.getCoordinates
);

router.get('/getDistanceTime', 
    query('origin').isString().isLength({min : 3}),
    query('destination').isString().isLength({min : 3}),
    authMiddleware.checkUser,
    mapController.getDistanceTime
);

router.get('/getSuggestions',
    query('input').isString().isLength({min : 3}),
    authMiddleware.checkUser,
    mapController.getAutoCompleteSuggestions
)
module.exports = router;

