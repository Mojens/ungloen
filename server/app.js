import dotenv from 'dotenv/config';

import express from 'express';
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

import http from "http";
const server = http.createServer(app)

import { Server } from 'socket.io';
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["*"]
    }
});

io.on('connection', (socket) => {

    socket.on("joinRoom", (team) => {
        socket.join(team.teamId);
        socket.emit("userJoined", team.user);
        socket.to(team.teamId).emit("userJoined", team.user);
    });
    socket.on("leaveRoom", (team) => {
        socket.leave(team.teamId);
        socket.emit("userLeft", team.user);
        socket.to(team.teamId).emit("userLeft", team.user);
    });
    socket.on('chatMessage', (data) => {
        io.to(data.room).emit('message', data);
      });
      socket.on("invites", (data)=> {
        io.emit("invitesRecieved", data);
        
    });
});

import loginRouter from './routers/loginRouter.js';
app.use(loginRouter);

import userRouter from './routers/userRouter.js';
app.use(userRouter);

import forumRouter from './routers/forumRouter.js';
app.use(forumRouter);

import taxRouter from './routers/taxRouter.js';
app.use(taxRouter);

import shareDollarRouter from './routers/shareDollarRouter.js';
app.use(shareDollarRouter);

import googleRouter from './routers/googleMapsRouter.js';
app.use(googleRouter);



server.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
})