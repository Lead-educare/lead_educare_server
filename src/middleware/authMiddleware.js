const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const authVerifyMiddleware = async (req, res, next)=>{
    try {
        let token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        token = token.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = userService.findUserByProperty('_id', decoded._id)
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch (e) {
        return res.status(400).json({ message: 'Invalid token' });
    }
}

module.exports = {authVerifyMiddleware}