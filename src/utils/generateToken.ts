const jwt = require('jsonwebtoken');

function generateToken(user: string, secret: string){
    return jwt.sign(user, secret, { expiresIn: "10min" });
}

module.exports = generateToken;
    
