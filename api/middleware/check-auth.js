const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = ((req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const verifyToken = jwt.verify(token, config.jwt.key);
        req.userData = verifyToken;
        next();
    }catch(error){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
})