const {Schema, model} = require("mongoose");

const permissionSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, {versionKey: false, timestamps: true});

const Permission = model('Permission', permissionSchema);

module.exports = Permission;