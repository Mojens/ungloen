import express from 'express';
import dotenv from 'dotenv/config';

const app = express();
app.use(express.json());

import cors from 'cors';
app.use(cors({
    credentials: true,
    origin: true,
    secret: process.env.CORS_SECRET
}));

import rateLimit from 'express-rate-limit';
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(apiLimiter);

import session from 'express-session';
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

import loginRouter from './routers/loginRouter.js';
app.use(loginRouter);

import userRouter from './routers/userRouter.js';
app.use(userRouter);



app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
})