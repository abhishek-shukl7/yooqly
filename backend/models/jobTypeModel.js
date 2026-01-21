const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  required: { type: Boolean, default: false },
  values: { type: [mongoose.Schema.Types.Mixed], default: [] },
  allowsCustomInput: { type: Boolean, default: false },
  customInputLabel: { type: String, default: 'Other' }
}, { _id: false });

const TypeSchema = new mongoose.Schema({
  customId: { type: String },
  name: { type: String, required: true },
  fields: { type: [FieldSchema], default: [] }
}, { _id: true });

const jobTypeSchema = new mongoose.Schema({
  customId: { type: String },
  name: { type: String, required: true },
  type: { type: [TypeSchema], default: [] },
  fields: { type: [FieldSchema], default: [] }
}, { timestamps: true });

// Auto-generate customId if not provided
jobTypeSchema.pre('save', function (next) {
  if (!this.customId) {
    this.customId = uuidv4();
  }
  // Also generate for subtypes
  if (this.type && this.type.length > 0) {
    this.type.forEach(subtype => {
      if (!subtype.customId) {
        subtype.customId = uuidv4();
      }
    });
  }
  next();
});

const jobTypeModel = mongoose.model('Jobtype', jobTypeSchema);

module.exports = jobTypeModel;