const { Router } = require('express');
const { verifyRole } = require('../middlewares/verifyRole.middleware');

const coordinateController = require('../controllers/coordinates.controller');

const govUserRouter = Router();

govUserRouter.post(
    'resolve-coordinate/:id',
    verifyRole('gov-user'),
    coordinateController.resolveCoordinate
);
govUserRouter.get('/coordinates', coordinateController.getCoordinates);

module.exports = { govUserRouter };
