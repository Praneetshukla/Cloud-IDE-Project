const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          enum: ['viewer', 'editor', 'admin'],
          default: 'viewer',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    icon: {
      type: String,
      default: 'HiOutlineCube', // Default icon reference
    },
    color: {
      type: String,
      default: 'from-indigo-500 to-purple-600', // Default gradient classes
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by owner
workspaceSchema.index({ owner: 1 });

// Cascade delete projects when a workspace is deleted
workspaceSchema.pre('findOneAndDelete', async function (next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    await mongoose.model('Project').deleteMany({ workspace: docToUpdate._id });
  }
  next();
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

module.exports = Workspace;
