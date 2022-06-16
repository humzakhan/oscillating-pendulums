const Joi = require('joi');

const pendulumConfig = {
    body: Joi.object().keys({
        initialOffset: Joi.number().required().min(-30).max(30),
        mass: Joi.number().required().min(0).max(100),
        stringLength: Joi.number().required().min(0).max(200),
        maximumWindFactor: Joi.number().required().min(1).max(100)
    }),
};

module.exports = {
    pendulumConfig
};