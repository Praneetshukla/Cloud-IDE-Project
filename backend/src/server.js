const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables FIRST — before any other module
dotenv.config();

const createApp = require('./app');
const connectDatabase = require('./config/database');

/**
 * Server entry point.
 * Connects to MongoDB, creates Express app, initializes Socket.io,
 * and starts listening.
 */
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io (will be expanded in Phase 9)
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      destroyUpgrade: false,
    });

    const registerEditorHandlers = require('./socket/editorHandler');

    // Socket.io connection handler
    io.on('connection', (socket) => {
      console.log(`🔌 Socket connected: ${socket.id}`);

      // Register live collaboration events
      registerEditorHandlers(io, socket);

      socket.on('disconnect', () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
      });
    });

    // Make io accessible in routes/controllers if needed
    app.set('io', io);

    // ─── Yjs WebSocket Server ───────────────────────────────────
    const WebSocket = require('ws');
    const { setupWSConnection } = require('y-websocket/bin/utils');

    const wss = new WebSocket.Server({ noServer: true });
    
    server.on('upgrade', (request, socket, head) => {
      console.log(`[HTTP Upgrade] Request URL: ${request.url}`);
      // Yjs connections will use the /yjs path
      if (request.url.startsWith('/yjs')) {
        console.log(`[HTTP Upgrade] Routing to Yjs websocket server`);
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      }
      // Note: socket.io handles its own upgrades natively because we passed 'server' to it.
    });

    wss.on('connection', (ws, req) => {
      console.log(`📡 Yjs WebSocket connected: ${req.url}`);
      setupWSConnection(ws, req);
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`\n🚀 Orbit API Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
      console.log(`💊 Health: http://localhost:${PORT}/api/health\n`);
    });

    // ─── Graceful Shutdown ──────────────────────────────────────
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(() => {
        console.log('💤 HTTP server closed.');

        const mongoose = require('mongoose');
        mongoose.connection.close(false).then(() => {
          console.log('💤 MongoDB connection closed.');
          process.exit(0);
        });
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown due to timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error('💥 UNHANDLED REJECTION:', err.message);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('💥 UNCAUGHT EXCEPTION:', err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
