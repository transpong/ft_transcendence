import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { getCookie } from '../../helpers/get-cookie';

const socket = io('http://localhost:3001', {
  extraHeaders: {
    Authorization: `Bearer ${getCookie("token")}`,
    Custom: 'true',
  },
}); // Replace with your server URL

const Frontend: React.FC = () => {
  useEffect(() => {
    // Connect to the socket server
    socket.connect();
    // console.log('Conect Front');
    // Send 'joinRoom' message when the component mounts
    socket.emit('joinRoom');

    socket.on('startGame', (message: string) => {
        socket.emit('startGame');
        console.log('Game Startou', message);
    });

    // Listen for 'message' events and log the received messages
    socket.on('message', (message: string) => {
      console.log('Received message:', message);
    });


    socket.on('pong', (message: string) => {
        console.log('Received message:', message);
    });

    socket.on('endGame', (message: string) => {
        socket.emit('endGame');
        console.log('Game Over:', message);
    });

  }, []);

  return <div>Frontend</div>;
};

export class GameBackEnd {
  socket;

  constructor() {
    this.socket = io('http://localhost:3001', {
        extraHeaders: {
        Authorization: `Bearer ${getCookie("token")}`,
        Custom: 'true',
      },
    });

    this.socket.on('startGame', (message: string) => {
        this.socket.emit('startGame');
        console.log('Game Startou', message);
    });

        // Listen for 'message' events and log the received messages
        this.socket.on('message', (message: string) => {
          console.log('Received message:', message);
        });
    }

  handleJoinRoom() {
    this.socket.connect();
    console.log('Front Join Room');
    this.socket.emit('joinRoom');
  }
}

