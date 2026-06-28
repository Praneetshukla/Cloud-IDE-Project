const mongoose = require('mongoose');

const terminalSessionSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File',
      required: true
    },
    command: {
      type: String,
      required: true
    },
    output: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['success', 'error', 'timeout'],
      required: true
    },
    executionTimeMs: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const TerminalSession = mongoose.model('TerminalSession', terminalSessionSchema);
module.exports = TerminalSession;
