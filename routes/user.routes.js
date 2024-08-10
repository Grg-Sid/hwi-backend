const { Router } = require('express');

const coordinateController = require('../controllers/coordinates.controller');

const userRouter = Router();

userRouter.post('/locate-me', coordinateController.locateMe);
userRouter.get('/coordinates', coordinateController.getCoordinates);

module.exports = { userRouter };
