const {Schema, model} = require('mongoose');
const {ObjectId} = Schema.Types;

const paymentSchema = new Schema({
    userId:{
        type: ObjectId,
        ref: 'User'
    },
    courseId: {
        type: ObjectId,
        ref: 'Course'
    },
    amount: {
        type: String,
        required: [true, 'amount is required']
    },
    status: {
        type: String,
    },
    paymentMethod: {
        type: String,
    },
    transaction: {}
}, {timestamps: true, versionKey: false});

const Payment = model('Payment', paymentSchema);

module.exports = Payment;