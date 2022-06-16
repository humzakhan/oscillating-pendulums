const express = require('express');
const validate = require('../../validators/validate');
const pendulumValidator = require('../../validators/pendulum.validators');
const pendulumController = require('../../controllers/pendulum.controller');

const router = express.Router();

router.get('/instance', pendulumController.getInstanceInformation);
router.post('/config', validate(pendulumValidator.pendulumConfig), pendulumController.configurePendulum);

module.exports = router;