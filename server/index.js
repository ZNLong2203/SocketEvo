const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');
const mainRoute = require('./routes/main.route');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
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
        origin: "http://localhost:3000",
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
})