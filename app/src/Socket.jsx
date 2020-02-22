import {
  useState, useEffect, createContext,
} from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState({});

  useEffect(() => {
    const sock = io('http://localhost:8080');
    setSocket(sock);

    sock.on('connect', () => {
      console.log('CONNECTED');
    });
  }, []);

  const value = {
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
