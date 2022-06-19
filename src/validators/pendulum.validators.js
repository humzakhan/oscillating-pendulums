const Joi = require('joi');

const pendulumConfig = {
    body: Joi.object().keys({
        initialOffset: Joi.number().min(-1.42).max(1.42).default(0.78),
        mass: Joi.number().required().min(10).max(90),
        stringLength: Joi.number().required().min(100).max(500),
        maximumWindFactor: Joi.number().required().min(1).max(10),
        color: Joi.string().default('#9b9888')
    }),
};

module.exports = {
    pendulumConfig
};