
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.header('auth-token');

        if (!token) {
            return res.status(401).json({ msg: 'No authorization token provided.' });
        }

        const verified = jwt.verify(token, "passwordKey");

        if (!verified) {
            return res.status(401).json({ msg: 'Token verification failed, authorization denied.' });
        }

        const user = await User.findById(verified.userId);

        if (!user || user.userType !== 'admin') {
            return res.status(401).json({ msg: 'You are not an admin!' });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports =
    adminMiddleware

    ;
