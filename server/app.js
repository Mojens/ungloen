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

import forumRouter from './routers/forumRouter.js';
app.use(forumRouter);



app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
})