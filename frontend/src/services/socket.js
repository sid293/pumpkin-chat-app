import { io } from 'socket.io-client';

let socket;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const initializeSocket = (user) => {
  socket = io(BACKEND_URL, {
    autoConnect: false
  });

  socket.connect();

  socket.emit('user:login', { user });

  socket.on('users', ({ users }) => {
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
