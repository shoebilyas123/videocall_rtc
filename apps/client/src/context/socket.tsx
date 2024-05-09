import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { Socket, io } from 'socket.io-client';

export interface SocketContextCtx {
  socket: Socket;
}

export const SocketContext = createContext<SocketContextCtx>(
  {} as SocketContextCtx
);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: FC<PropsWithChildren> = (props) => {
  const socket = useMemo(() => io('localhost:8000'), []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};
