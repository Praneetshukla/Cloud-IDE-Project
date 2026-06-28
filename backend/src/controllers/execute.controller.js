const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const File = require('../models/File');
const Project = require('../models/Project');
const TerminalSession = require('../models/TerminalSession');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Execute a file and return output
 * @route   POST /api/projects/:projectId/execute
 * @access  Private
 */
exports.executeFile = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { fileId } = req.body;

  if (!fileId) {
    return next(new AppError('File ID is required', 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  const file = await File.findOne({ _id: fileId, project: projectId });
  if (!file) {
    return next(new AppError('File not found in this project', 404));
  }

  const ext = file.name.split('.').pop().toLowerCase();
  
  // Supported languages for Lite version
  const supportedRunners = {
    'js': 'node',
    'py': 'python',
    // In some systems python is python3
  };

  if (!supportedRunners[ext]) {
    return next(new AppError(`Execution for .${ext} files is not supported yet.`, 400));
  }

  const runner = supportedRunners[ext];
  const tempDir = os.tmpdir();
  const tempFileName = `orbit_exec_${Date.now()}_${file.name}`;
  const tempFilePath = path.join(tempDir, tempFileName);

  // Write content to temp file
  await fs.writeFile(tempFilePath, file.content, 'utf8');

  let output = '';
  let execStatus = 'success';
  const startTime = Date.now();

  try {
    // Run the file with a timeout of 5 seconds to prevent infinite loops
    const { stdout, stderr } = await execPromise(`${runner} "${tempFilePath}"`, { timeout: 5000 });
    output = stdout + (stderr ? `\n[STDERR]\n${stderr}` : '');
  } catch (error) {
    if (error.killed && error.signal === 'SIGTERM') {
      execStatus = 'timeout';
      output = 'Error: Execution timed out after 5 seconds.\nPossibly an infinite loop?';
    } else {
      execStatus = 'error';
      output = error.stdout + (error.stderr ? `\n[STDERR]\n${error.stderr}` : '') + (error.message ? `\n[ERROR]\n${error.message}` : '');
    }
  } finally {
    // Cleanup temp file
    try {
      await fs.unlink(tempFilePath);
    } catch (e) {
      console.error('Failed to cleanup temp file', e);
    }
  }

  const executionTimeMs = Date.now() - startTime;

  // Log session to DB
  const session = await TerminalSession.create({
    project: projectId,
    file: fileId,
    command: `${runner} ${file.name}`,
    output,
    status: execStatus,
    executionTimeMs
  });

  res.status(200).json({
    status: 'success',
    data: {
      session
    }
  });
});
