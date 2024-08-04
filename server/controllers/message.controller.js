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
        if(from && to) {
            const messagesList = await prisma.messages.findMany({
                where: {
                    OR: [
                        {
                            sender_id: parseInt(from),
                            receiver_id: parseInt(to)
                        },
                        {
                            sender_id: parseInt(to),
                            receiver_id: parseInt(from)
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'asc'
                },
            })

            const unreadMessages = [];
            messagesList.forEach((message, index) => {
                if(message.messageStatus !== 'read' && message.senderId === parseInt(to)) {
                    message[index].messageStatus = 'read';
                    unreadMessages.push(message.id);
                }
            })

            await prisma.messages.updateMany({
                where: {
                    id: {
                        in: unreadMessages
                    }
                }, 
                data: {
                    messageStatus: 'read'
                }
            })

            return res.status(200).json({
                messages: messagesList
            });
        } 
        return res.status(400).json({ message: 'From and to are required' });
    } catch(err) {
        next(err);
    }
}

exports.uploadImageMessages = async (req, res, next) => {
    try {
        if(req.file) {
            const date = Date.now();
            let fileName = "uploads/images/" + date + req.file.originalname;
            renameSync(req.file.path, fileName);

            const { from, to } = req.query;
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
            const { userId, chatId } = req.body;
            const audioFile = req.file.path;
    
            const newMessages =  await prisma.messages.create({
                data: {
                    messages: audioFile,
                    type: 'audio',
                    sender: {connect: {id: parseInt(userId)}},
                    receiver: {connect: {id: parseInt(chatId)}},
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