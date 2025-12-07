const mongoose = require('mongoose');
const { Schema } = mongoose;

// const ValueSchema = new mongoose.Schema({
//   type: mongoose.Schema.Types.Mixed // values can be string, number, array, etc.
// }, { _id: false });

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  required: { type: Boolean, default: false },
  values: { type: [mongoose.Schema.Types.Mixed], default: [] }
}, { _id: false });

const TypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fields: { type: [FieldSchema], default: [] }
}, { _id: false });

const jobTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: [TypeSchema], default: [] },
  fields: { type: [FieldSchema], default: [] }
}, { timestamps: true });

const jobTypeModel = mongoose.model('Jobtype', jobTypeSchema);

module.exports = jobTypeModel;