const getPrismaInstant = require('../utils/PrismaClient');
const prisma = getPrismaInstant();

exports.createProfile = async (req, res, next) => {
    try {
        const { email, name, about, image} = req.body;
        if(!email || !name) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        await prisma.user.create({
            data: {
                email,
                name,
                about,
                image
            }
        })
        return res.status(201).json({ message: 'Profile created' });
    } catch(err) {
        next(err);
    }
}

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                about: true,
                image: true
            },
            orderBy: {
                name: 'asc'
            }
        })
        
        const usersGroupByAlphabet = {};
        users.forEach((user) => {
            const firstLetter = user.name.charAt(0).toUpperCase();
            if(!usersGroupByAlphabet[firstLetter]) {
                usersGroupByAlphabet[firstLetter] = [];
            }
            usersGroupByAlphabet[firstLetter].push(user);
        })

        return res.status(200).json({
            users: usersGroupByAlphabet
        })
    } catch(err) {
        next(err);
    }
}