const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxLength: [100, 'File name cannot exceed 100 characters']
    },
    content: {
      type: String,
      default: ''
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
      index: true
    },
    language: {
      type: String,
      default: 'plaintext'
    }
  },
  {
    timestamps: true
  }
);

// Ensure no duplicate file names within the same folder/project
fileSchema.index({ project: 1, folder: 1, name: 1 }, { unique: true });

// Pre-save hook to determine language based on extension if not explicitly set
fileSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    const ext = this.name.split('.').pop().toLowerCase();
    const langMap = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown'
    };
    if (ext && ext !== this.name) {
      this.language = langMap[ext] || 'plaintext';
    } else {
      this.language = 'plaintext';
    }
  }
  next();
});

const File = mongoose.model('File', fileSchema);
module.exports = File;
