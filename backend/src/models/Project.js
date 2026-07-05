const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    language: {
      type: String,
      enum: ['javascript', 'typescript', 'python', 'html', 'react', 'node', 'other'],
      default: 'javascript',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster dashboard queries
projectSchema.index({ owner: 1, lastAccessed: -1 });
projectSchema.index({ workspace: 1 });

// Cascade delete workspaces, files, and folders when a project is deleted
projectSchema.pre('findOneAndDelete', async function(next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    // Optionally delete workspace ref, but workspace usually owns project
    // Cascade to files and folders
    await mongoose.model('Folder').deleteMany({ project: docToUpdate._id });
    await mongoose.model('File').deleteMany({ project: docToUpdate._id });
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
