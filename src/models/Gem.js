const {Schema, model} = require('mongoose');

const {ObjectId} = Schema.Types;
const gemSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User'
    },
    gem: {
        type: Number
    },
}, {versionKey: false, timestamps: true});

const Gem = model('Gem', gemSchema);

module.exports = Gem;