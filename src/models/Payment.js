const {Schema, model} = require('mongoose');

const paymentSchema = new Schema({

});

const Payment = model('Payment', paymentSchema);

module.exports = Payment;