const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (payload)=>{
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: '24h'
    });
}
const hashPassword = (password)=>{
    return bcrypt.hashSync(password);
}
const comparePassword = ({password, hash})=>{
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    createToken, hashPassword, comparePassword,
}