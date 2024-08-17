const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const { Server } = require('socket.io');
const mainRoute = require('./routes/main.route');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(compression());
app.use(cors({
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio'), {
    acceptRanges: true
}));
app.use('/', mainRoute);

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: err
    })
})

const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
})

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    }
})

global.onlineUsers = new Map();
io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send-message", (data) => {
        const receiverSocket = onlineUsers.get(data.to);
        if(receiverSocket) {
            io.to(receiverSocket).emit("msg-receive", data);
        }
    })
    socket.on("outgoing-voice-call", (data) => {
        const receiverSocket = onlineUsers.get(data.to);
        if(receiverSocket) {
            io.to(receiverSocket).emit("incoming-voice-call", data);
        }
    })
    socket.on("outgoing-video-call", (data) => {
        const receiverSocket = onlineUsers.get(data.to);
        if(receiverSocket) {
            io.to(receiverSocket).emit("incoming-video-call", data);
        }
    })
    socket.on("reject-voice-call", (data) => {
        const receiverSocket = onlineUsers.get(data.from);
        if(receiverSocket) {
            io.to(receiverSocket).emit("reject-voice-call");
        }
    })
    socket.on("reject-video-call", (data) => {
        const receiverSocket = onlineUsers.get(data.from);
        if(receiverSocket) {
            io.to(receiverSocket).emit("reject-video-call");
        }
    })
    socket.on("accept-incoming-call", (data) => {
        const receiverSocket = onlineUsers.get(id);
        if(receiverSocket) {
            io.to(receiverSocket).emit("accept-call");
        }
    })
})