const express = require('express');
const validate = require('../../validators/validate');
const pendulumValidator = require('../../validators/pendulum.validators');
const pendulumController = require('../../controllers/pendulum.controller');

const router = express.Router();

router
    .route('/')
    .get(pendulumController.getCoordinates);

router.post('/config', validate(pendulumValidator.pendulumConfig), pendulumController.configurePendulum);

module.exports = router;