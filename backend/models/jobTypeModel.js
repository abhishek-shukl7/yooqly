const mongoose = require('mongoose');
const { Schema } = mongoose;

const FieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  values: {
    type: [String],
    default: []
  }
});

const jobTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  fields: {
    type: [FieldSchema],
    default: []
  }
}, { timestamps: true });

const jobTypeModel = mongoose.model('Jobtype', jobTypeSchema);

module.exports = jobTypeModel;