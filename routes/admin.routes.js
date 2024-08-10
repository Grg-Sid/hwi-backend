const { Router } = require('express');
const { verifyRole } = require('../middlewares/verifyRole.middleware');

const userController = require('../controllers/user.controller');

const adminRouter = Router();

adminRouter.post(
    '/create-gov-user',
    verifyRole('admin'),
    userController.createGovUser
);

module.exports = { adminRouter };
