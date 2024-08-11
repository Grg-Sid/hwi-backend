const { Router } = require('express');
const { verifyRole } = require('../middlewares/verifyRole.middleware');

const coordinateController = require('../controllers/coordinates.controller');

const govUserRouter = Router();

govUserRouter.get(
    '/resolve-coordinate/:id',
    verifyRole('gov'),
    coordinateController.resolveCoordinate
);
govUserRouter.get('/coordinates', coordinateController.getAllCoordinates);

module.exports = { govUserRouter };
