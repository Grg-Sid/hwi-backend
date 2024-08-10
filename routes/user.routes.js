const { Router } = require('express');

const userController = require('../controllers/user.controller');

const userRouter = Router();

userRouter.post('/locate-me', userController.locateMe);
userRouter.get('/coordinates', userController.getCoordinates);

module.exports = { userRouter };
