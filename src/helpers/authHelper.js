const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (user)=>{
    const payload = {
        _id: user._id,
        email: user.email,
        mobile: user.mobile,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        verified: user.verified,
        role: {
            _id: user.role._id,
            name: user.role.name,
        },
        permissions: user.permissions,
    };
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