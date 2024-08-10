require('dotenv').config();
const express = require('express');
const cors = require('cors');

const crypto = require('crypto');
const { exec } = require('child_process');

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
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
app.post('/webhook', (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
    const digest =
        'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    if (signature === digest) {
        if (req.body.ref === 'refs/heads/main') {
            exec(
                'cd /path/to/your/app && git pull && npm install && pm2 restart all',
                (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        return res.sendStatus(500);
                    }
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                    res.sendStatus(200);
                }
            );
        } else {
            res.sendStatus(200);
        }
    } else {
        res.sendStatus(403);
    }
});

app.post('/signup', userController.createUser);
app.post('/signin', authController.handleLogin);

app.use(authenticateToken);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/gov-user', govUserRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
