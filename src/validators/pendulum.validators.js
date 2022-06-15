const Joi = require('joi');

const pendulumConfig = {
    body: Joi.object().keys({
        initialOffset: Joi.number().required().min(0).max(100),
        mass: Joi.number().required().min(0).max(100),
        stringLength: Joi.number().required().min(0).max(100),
        maximumWindFactor: Joi.number().required().min(0).max(100)
    }),
};

module.exports = {
    pendulumConfig
};