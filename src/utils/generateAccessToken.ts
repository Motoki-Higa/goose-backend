const jwt = require('jsonwebtoken');

function generateAccessToken(user: string){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10min' });
}

module.exports = generateAccessToken;
    
