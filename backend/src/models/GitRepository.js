const mongoose = require('mongoose');

const fileSnapshotSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  content: {
    type: String,
    default: ''
  }
}, { _id: false });

const commitSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  snapshots: [fileSnapshotSchema]
});

const gitRepositorySchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      unique: true,
      index: true
    },
    commits: [commitSchema]
  },
  {
    timestamps: true
  }
);

const GitRepository = mongoose.model('GitRepository', gitRepositorySchema);
module.exports = GitRepository;
