const express = require('express');
const pendulumRoutes = require('./pendulum.routes');

const router = express.Router();

const appRoutes = [
    {
        path: '/pendulum',
        route: pendulumRoutes
    }
];

appRoutes.forEach((route) => {
    router.use(route.path, route.route);
}); 

module.exports = router;