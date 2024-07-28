const getPrismaInstant = require('./PrismaClient');

exports.isAuth = async (req, res, next) => {
    try {
        const { email } = req.body;
        if(!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const prisma = getPrismaInstant();
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ 
            message: 'User found',
            data: user
        });    
    } catch(err) {
        next(err);
    }
}