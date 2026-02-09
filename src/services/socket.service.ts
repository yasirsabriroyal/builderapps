import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinProject(projectId: string): void {
    if (this.socket) {
      this.socket.emit('join-project', projectId);
    }
  }

  leaveProject(projectId: string): void {
    if (this.socket) {
      this.socket.emit('leave-project', projectId);
    }
  }

  onProjectUpdate(callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on('project-update', callback);
    }
  }

  onFloorPlanUpdate(callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on('floor-plan-update', callback);
    }
  }

  onUserJoined(callback: (data: { userId: string; userName: string }) => void): void {
    if (this.socket) {
      this.socket.on('user-joined', callback);
    }
  }

  onUserLeft(callback: (data: { userId: string }) => void): void {
    if (this.socket) {
      this.socket.on('user-left', callback);
    }
  }

  emitFloorPlanUpdate(projectId: string, data: unknown): void {
    if (this.socket) {
      this.socket.emit('floor-plan-update', { projectId, data });
    }
  }

  off(event: string, callback?: (...args: unknown[]) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
