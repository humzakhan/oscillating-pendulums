const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'test', 'development').required(),
        PORT: Joi.number().default(3000),
        INSTANCE_NEIGHBOR: Joi.number(),
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        REDIS_PASSWORD: Joi.string().required(),
        WSB_HOST: Joi.string().required().default("localhost"),
        WSB_PORT: Joi.number().required().default(8080),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`An error occurred when validating config values: ${error.message}`);
}

const constructKey = (key) => {
    return `instance-${envVars.PORT}-${key}`;
}

const constructNeighborKey = (key) => {
    return `instance-${envVars.INSTANCE_NEIGHBOR}-${key}`;
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    instanceNeighbor: envVars.INSTANCE_NEIGHBOR,
    redisHost: envVars.REDIS_HOST,
    redisPort: envVars.REDIS_PORT,
    redisPassword: envVars.REDIS_PASSWORD,
    wsbHost: envVars.WSB_HOST,
    wsbPort: envVars.WSB_PORT,
    constructKey,
    constructNeighborKey
};