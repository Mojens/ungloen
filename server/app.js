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
/*
function checkSession(req, res, next) {
    if (!req.session.user) {
        return res.status(401).send({ 
            message: "Du er ikke logget ind",
            status: 401
        });             
    }
    next();
}          
app.use('/api/private', checkSession);      
*/



import loginRouter from './routers/loginRouter.js';
app.use(loginRouter);

import userRouter from './routers/userRouter.js';
app.use(userRouter);

import forumRouter from './routers/forumRouter.js';
app.use(forumRouter);

import taxRouter from './routers/taxRouter.js';
app.use(taxRouter);

import googleRouter from './routers/googleMapsRouter.js';
app.use(googleRouter);



app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
})