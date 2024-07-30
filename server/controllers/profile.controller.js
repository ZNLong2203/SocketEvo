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