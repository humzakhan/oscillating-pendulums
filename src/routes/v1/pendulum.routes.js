const express = require('express');
const validate = require('../../validators/validate');
const pendulumValidator = require('../../validators/pendulum.validators');
const pendulumController = require('../../controllers/pendulum.controller');

const router = express.Router();

router.get('/instance', pendulumController.getInstanceInformation);

router
    .route('/config')
    .get(pendulumController.getPendulumConfig)
    .post(validate(pendulumValidator.pendulumConfig), pendulumController.configurePendulum);

router
    .route('/position')
    .get(pendulumController.getCurrentPosition)
    .post(pendulumController.updatePosition);

module.exports = router;