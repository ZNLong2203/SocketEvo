const getPrismaInstant = require('../utils/PrismaClient');
const { renameSync } = require('fs');
const path = require('path');
const prisma = getPrismaInstant();

exports.addMessage = async (req, res, next) => {
    try {
        const { message, from, to } = req.body;
        const getUser = onlineUsers.get(to);
        if(message && from && to) {
            const newMessage = await prisma.messages.create({
                data: {
                    messages: message,
                    sender: {connect: {id: parseInt(from)}},
                    receiver: {connect: {id: parseInt(to)}},
                    messageStatus: getUser ? "delivered" : "sent"
                },
                include: { sender: true, receiver: true}
            });

            return res.status(200).json({
                messages: newMessage
            });
        }
        return res.status(400).json({ message: 'Message, from and to are required' });
    } catch(err) {
        next(err);
    }
}

exports.getMessages = async (req, res, next) => {
    try {
        const { from, to } = req.params;
        const fromId = parseInt(from);
        const toId = parseInt(to);

        // Check if fromId and toId are valid numbers
        if (!isNaN(fromId) && !isNaN(toId)) {
            const messagesList = await prisma.messages.findMany({
                where: {
                    OR: [
                        {
                            sender_id: fromId,
                            receiver_id: toId
                        },
                        {
                            sender_id: toId,
                            receiver_id: fromId
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'asc'
                },
            });

            const unreadMessages = [];
            messagesList.forEach((message, index) => {
                if (message.messageStatus !== 'read' && message.sender_id === toId) {
                    message.messageStatus = 'read'; 
                    unreadMessages.push(message.id);
                }
            });

            if (unreadMessages.length > 0) {
                await prisma.messages.updateMany({
                    where: {
                        id: {
                            in: unreadMessages
                        }
                    },
                    data: {
                        messageStatus: 'read'
                    }
                });
            }

            return res.status(200).json({
                messages: messagesList
            });
        } else {
            return res.status(400).json({ message: 'Invalid parameters: from and to must be numbers.' });
        }
    } catch (err) {
        next(err);
    }
}

exports.uploadImageMessages = async (req, res, next) => {
    try {
        if(req.file) {
            const date = Date.now();
            let fileName = "uploads/images/" + date + req.file.originalname;
            renameSync(req.file.path, fileName);

            const { from, to } = req.body;
            if(from && to) {
                const messages = await prisma.messages.create({
                    data: {
                        messages: fileName,
                        type: 'image',
                        sender: {connect: {id: parseInt(from)}},
                        receiver: {connect: {id: parseInt(to)}},
                    }
                })
                return res.status(200).json({
                    messages
                })
            }
            return res.status(400).json({ message: 'From and to are required' });
        }
        return res.status(400).json({ message: 'Image is required'});
    } catch(err) {
        next(err);
    }
}

exports.uploadAudioMessages = async (req, res, next) => {
    try {
        if(req.file) {
            const date = Date.now();
            let fileName = "uploads/audio/" + date + req.file.originalname;
            renameSync(req.file.path, fileName);

            const { from, to } = req.body;
            const newMessages =  await prisma.messages.create({
                data: {
                    messages: fileName,
                    type: 'audio',
                    sender: {connect: {id: parseInt(from)}},
                    receiver: {connect: {id: parseInt(to)}},
                }
            })
            return res.status(200).json({
                messages: newMessages
            });
        } 
        return res.status(400).json({ message: 'Audio is required' });
    } catch(err) {
        next(err);
    }
}

exports.getInitialContactsWithMessages = async (req, res, next) => {
    try {
        const userId = req.params.from;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            include: {
                sendMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                receiveMessages: {
                    include: {
                        receiver: true,
                        sender: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        const messages = [...user.sendMessages, ...user.receiveMessages];
        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const users = new Map();
        const messagesStatusChange = [];

        messages.forEach((msg) => {
            const isSender = msg.sender_id === parseInt(userId);
            const calculatedId = isSender ? msg.receiver_id : msg.sender_id;
            if (msg.messageStatus === "sent") {
                messagesStatusChange.push(msg.id);
            }
            const {
                id,
                type,
                messages,
                messageStatus,
                createdAt,
                sender_id,
                receiver_id,
            } = msg;
            if (!users.get(calculatedId)) {
                let user = {
                    message_id: id,
                    type,
                    messages,
                    messageStatus,
                    createdAt,
                    sender_id,
                    receiver_id,
                };
                if (isSender) {
                    user = {
                        ...user,
                        ...msg.receiver,
                        totalUnreadMessages: 0,
                    }
                } else {
                    user = {
                        ...user,
                        ...msg.sender,
                        totalUnreadMessages: messageStatus === "read" ? 0 : 1
                    }
                }
                users.set(calculatedId, { ...user });
            } else if (messageStatus !== "read" && !isSender) {
                const user = users.get(calculatedId);
                users.set(calculatedId, {
                    ...user,
                    totalUnreadMessages: user.totalUnreadMessages + 1
                });
            }
        });

        // Mark the message as delivered if the user is online
        if (messagesStatusChange.length) {
            await prisma.messages.updateMany({
                where: {
                    id: {
                        in: messagesStatusChange,
                    },
                },
                data: {
                    messageStatus: "delivered",
                },
            });
        }

        return res.status(200).json({
            users: Array.from(users.values()),
            onlineUsers: Array.from(onlineUsers.keys())
        });
    } catch (err) {
        next(err);
    }
}
