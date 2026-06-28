const AIChat = require('../models/AIChat');
const Project = require('../models/Project');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get AI chat history for a project (creates empty if it doesn't exist)
 * @route   GET /api/projects/:projectId/ai/chat
 * @access  Private
 */
exports.getChatHistory = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  let chat = await AIChat.findOne({ project: projectId });
  
  if (!chat) {
    chat = await AIChat.create({ 
      project: projectId, 
      messages: [{ role: 'assistant', content: 'Hello! I am your AI assistant. How can I help you with your project today?' }]
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      chat
    }
  });
});

/**
 * @desc    Send a message to AI and get a simulated response
 * @route   POST /api/projects/:projectId/ai/chat
 * @access  Private
 */
exports.sendMessage = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { message } = req.body;

  if (!message) {
    return next(new AppError('Message is required', 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // 1. Fetch or create chat document
  let chat = await AIChat.findOne({ project: projectId });
  if (!chat) {
    chat = new AIChat({ project: projectId, messages: [] });
  }

  // 2. Append user message
  chat.messages.push({ role: 'user', content: message });
  await chat.save();

  // 3. Simulate AI delay and response (since this is Orbit Lite)
  const simulateAI = () => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const responses = [
          "I've analyzed your code. Everything looks great!",
          "Consider refactoring that function for better readability.",
          "I can certainly help with that. Could you provide more details?",
          "That's an interesting approach to solving the problem.",
          "Have you tried using a `useEffect` hook for that in React?",
          "To fix that error, check if the variable is undefined before accessing it.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        chat.messages.push({ role: 'assistant', content: `[Simulated] ${randomResponse}` });
        await chat.save();
        resolve(chat);
      }, 1500); // 1.5s delay
    });
  };

  const updatedChat = await simulateAI();

  res.status(200).json({
    status: 'success',
    data: {
      chat: updatedChat
    }
  });
});
