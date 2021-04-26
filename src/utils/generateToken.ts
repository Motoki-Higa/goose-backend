const jwt = require('jsonwebtoken');

function generateToken(user: string, secret: string){
    return jwt.sign(user, secret, { expiresIn: "1min" });
}

module.exports = generateToken;
    
