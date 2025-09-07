const mongoose = require('mongoose');
const { Schema } = mongoose;

const counterSchema = new Schema({
    _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
}, { timestamps: true });

const counterModel = mongoose.model('Counter', counterSchema);

module.exports = counterModel;