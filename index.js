require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { authenticateToken } = require('./middlewares/auth.middleware');
const userController = require('./controllers/user.controller');
const authController = require('./controllers/auth.controller');

const { adminRouter } = require('./routes/admin.routes');
const { userRouter } = require('./routes/user.routes');
const { govUserRouter } = require('./routes/govUser.routes');

const port = process.env.PORT || 3000;
const app = express();

const corsOptions = {
    origin: '*',
};

app.use(cors(corsOptions));

app.use(express.json());

app.post('/signup', userController.createUser);
app.post('/signin', authController.handleLogin);

app.use(authenticateToken);
app.get('/signout', authController.handleLogout);
app.get('/me', userController.getUser);
app.get('/get-role', userController.getRole);

app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/gov', govUserRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
