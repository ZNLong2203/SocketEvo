const getPrismaInstant = require('../utils/PrismaClient');
const prisma = getPrismaInstant();

exports.login = async (req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return res.status(200).json({ 
            user
        });    
    } catch(err) {
        next(err);
    }
}

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