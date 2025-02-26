const User = require('../models/User');

const handleSocketConnection = async (io, socket) => {
  console.log('New client connected');

  // Handle user login
  socket.on('user:login', async ({ user }) => {
    console.log("user:login hit")
    try {
        let username = user.username;
      let dbUser = await User.findOneAndUpdate(
        { username },
        { isOnline: true, socketId: socket.id },
        { new: true }
      );
        if (!dbUser) {
          const newUser = new User({ socketId: socket.id, isOnline: true, ...user, id: require('crypto').randomBytes(12).toString('hex') });
          await newUser.save();
          dbUser = newUser;
        }
      const PendingMessages = require('../models/PendingMessages');
      let pendingMessages = await PendingMessages.findOne({ user: username });
      if (pendingMessages) {
        pendingMessages.messages.forEach(message => {
          socket.emit('message', { from: message.from, message: message.message, time: message.time });
        });
        await PendingMessages.deleteOne({ user: username });
      }

      if (dbUser) {
        const allUsers = await User.find({});
        io.emit('users', { users: allUsers });
        console.log("emitted all users")
      }
    } catch (error) {
      console.error('Error in user login:', error);
    }
  });

  socket.on('message', async ({ from, to, message }) => {
    try {
      const recipientUser = await User.findOne({ username: to.username });
      message.isMe = false;
      
      if (recipientUser && recipientUser.isOnline && recipientUser.socketId) {
        io.to(recipientUser.socketId).emit('message', { from, message, time: new Date() });
      } else {
        console.log("recipient offline saving to pending messages")
        const PendingMessages = require('../models/PendingMessages');
        let pendingMessages = await PendingMessages.findOne({ user: to.username });
        
        if (!pendingMessages) {
          pendingMessages = new PendingMessages({ user: to.username, messages: [] });
        }
        
        pendingMessages.messages.push({
          from,
          to,
          message,
          time: new Date()
        });
        
        await pendingMessages.save();
      }
    } catch (error) {
      console.error('Error in message handling:', error);
    }
  });

  socket.on('disconnect', async () => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { socketId: socket.id },
        { 
          isOnline: false, 
          socketId: null 
        },
        { new: true }
      );

      if (updatedUser) {
        const allUsers = await User.find({});
        const onlineUsers = await User.find({ isOnline: true });
        
        onlineUsers.forEach(user => {
          if (user.socketId) {
            io.to(user.socketId).emit('users', { users: allUsers });
          }
        });
      }
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  });
};

module.exports = { handleSocketConnection };
