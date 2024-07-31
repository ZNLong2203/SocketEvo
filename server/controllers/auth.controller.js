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

