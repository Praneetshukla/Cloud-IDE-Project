/**
 * Handles Socket.io events for the real-time code editor.
 * Manages project rooms, active users, code syncing, and cursor tracking.
 */

// In-memory store for active users per project room
// Structure: { projectId: [ { socketId, userId, name, color } ] }
const activeRooms = {};

const generateColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
};

const registerEditorHandlers = (io, socket) => {
  // Join a specific project room
  socket.on('join-project', ({ projectId, user }) => {
    if (!projectId || !user) return;

    socket.join(projectId);
    
    // Store user data on the socket instance
    socket.data.projectId = projectId;
    socket.data.user = {
      socketId: socket.id,
      userId: user._id || user.id,
      name: user.name,
      color: generateColor(user.name),
      activeFileId: null,
      activeFileName: null
    };

    if (!activeRooms[projectId]) {
      activeRooms[projectId] = [];
    }

    // Check if user is already in the room (e.g. multiple tabs)
    const existingUserIndex = activeRooms[projectId].findIndex(u => u.socketId === socket.id);
    if (existingUserIndex === -1) {
      activeRooms[projectId].push(socket.data.user);
    }

    // Broadcast updated user list to everyone in the room
    io.to(projectId).emit('active-users', activeRooms[projectId]);
  });

  // Handle active file change for presence
  socket.on('user-active-file', (data) => {
    // data: { projectId, fileId, fileName }
    const { projectId, fileId, fileName } = data;
    if (activeRooms[projectId]) {
      const userIndex = activeRooms[projectId].findIndex(u => u.socketId === socket.id);
      if (userIndex !== -1) {
        activeRooms[projectId][userIndex].activeFileId = fileId;
        activeRooms[projectId][userIndex].activeFileName = fileName;
        // Broadcast updated user list
        io.to(projectId).emit('active-users', activeRooms[projectId]);
      }
    }
  });

  // Handle code changes (basic sync)
  socket.on('code-change', (data) => {
    // data should contain { projectId, content }
    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(data.projectId).emit('code-change', data);
  });

  // Handle cursor and selection movements
  socket.on('cursor-change', (data) => {
    // data should contain { projectId, selections }
    // Add user info so clients know whose cursor it is
    socket.to(data.projectId).emit('cursor-change', {
      ...data,
      user: socket.data.user
    });
  });

  // Handle disconnecting
  socket.on('disconnect', () => {
    const { projectId, user } = socket.data;
    if (projectId && activeRooms[projectId]) {
      activeRooms[projectId] = activeRooms[projectId].filter(u => u.socketId !== socket.id);
      
      if (activeRooms[projectId].length === 0) {
        delete activeRooms[projectId];
      } else {
        // Broadcast updated user list
        io.to(projectId).emit('active-users', activeRooms[projectId]);
      }
      
      // Tell others this specific user disconnected so they can remove their cursor
      socket.to(projectId).emit('user-left', user);
    }
  });
};

module.exports = registerEditorHandlers;
