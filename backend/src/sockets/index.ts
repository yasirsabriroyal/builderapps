import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

interface SocketData {
  userId: number;
  projectId?: number;
}

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as { userId: number };
      (socket.data as SocketData).userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', (socket.data as SocketData).userId);

    socket.on('join-project', (projectId: number) => {
      socket.join(`project-${projectId}`);
      (socket.data as SocketData).projectId = projectId;
      console.log(`User ${(socket.data as SocketData).userId} joined project ${projectId}`);
    });

    socket.on('leave-project', (projectId: number) => {
      socket.leave(`project-${projectId}`);
      console.log(`User ${(socket.data as SocketData).userId} left project ${projectId}`);
    });

    socket.on('new-message', (data: { projectId: number; message: any }) => {
      io.to(`project-${data.projectId}`).emit('message-received', data.message);
    });

    socket.on('project-update', (data: { projectId: number; update: any }) => {
      socket.to(`project-${data.projectId}`).emit('project-updated', data.update);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', (socket.data as SocketData).userId);
    });
  });

  return io;
};
