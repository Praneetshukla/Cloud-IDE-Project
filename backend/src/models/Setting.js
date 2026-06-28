const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    theme: {
      type: String,
      default: 'vs-dark',
      enum: ['vs-dark', 'light']
    },
    fontSize: {
      type: Number,
      default: 14,
      min: 8,
      max: 32
    },
    tabSize: {
      type: Number,
      default: 2,
      enum: [2, 4, 8]
    },
    wordWrap: {
      type: String,
      default: 'on',
      enum: ['on', 'off', 'wordWrapColumn', 'bounded']
    }
  },
  {
    timestamps: true
  }
);

const Setting = mongoose.model('Setting', settingSchema);
module.exports = Setting;
