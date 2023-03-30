const {Schema, model} = require('mongoose');

const otpSchema = new Schema({
    email:{
        type: String
    },
    otp:{
        type: String
    },
    status:{
        type: Number,
        default:0
    },
    expire: {
        type: Date
    }
}, {timestamps: true, versionKey: false});

const Otp = model('Otp', otpSchema);

module.exports = Otp;