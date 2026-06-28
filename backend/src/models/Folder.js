const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxLength: [100, 'Folder name cannot exceed 100 characters']
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure no duplicate folder names within the same parent/project
folderSchema.index({ project: 1, parent: 1, name: 1 }, { unique: true });

// Cascade delete files and subfolders when a folder is deleted
folderSchema.pre('findOneAndDelete', async function(next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    // Delete all files inside this folder
    await mongoose.model('File').deleteMany({ folder: doc._id });
    
    // Find and delete all subfolders (which will trigger their own pre-delete hooks)
    const subfolders = await mongoose.model('Folder').find({ parent: doc._id });
    for (const subfolder of subfolders) {
      await mongoose.model('Folder').findOneAndDelete({ _id: subfolder._id });
    }
  }
  next();
});

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
