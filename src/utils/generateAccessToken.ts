const jwt = require('jsonwebtoken');

function generateAccessToken(user: string){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = generateAccessToken;
    
