import { createServer } from 'http';
import { Server } from 'socket.io';
import app_consts from 'app_constants';

// TODO: CONFIGURE dotenv.config({});

const _httpServer = createServer();

const io = new Server(_httpServer, {
  cors: {
    origin: 'http://localhost:5173  ',
    methods: ['GET', 'POST'],
  },
});

const {
  CALL_ACCEPTED,
  CALL_USER,
  INCOMING_CALL,
  PEER_NEG_NEEDED,
  PEER_NEG_DONE,
  JOIN_ROOM,
  NEW_USER_JOINED,
} = app_consts.SOCKET_CONST;

const aliasToRoomMap = new Map<string, string>();

io.on('connection', (socket) => {
  console.log(`SOCKET CONNECTED: ${socket.id}`);

  socket.on(JOIN_ROOM, ({ roomNumber, alias }) => {
    console.log({ roomNumber, alias, EM: aliasToRoomMap.get(alias) });
    if (aliasToRoomMap.has(alias)) {
      socket.leave(aliasToRoomMap.get(alias));
    }
    socket.join(roomNumber);
    io.to(roomNumber).emit(NEW_USER_JOINED, {
      remoteId: socket.id,
      remoteAlias: alias,
    });
    aliasToRoomMap.set(alias, roomNumber);
    io.to(socket.id).emit(JOIN_ROOM, { roomNumber, alias });
  });

  // User calls remote (with Offer)
  socket.on(CALL_USER, ({ to, offer }) => {
    io.to(to).emit(INCOMING_CALL, { offer, from: socket.id });
  });
  socket.on(CALL_ACCEPTED, ({ to, answer }) => {
    io.to(to).emit(CALL_ACCEPTED, { from: socket.id, answer });
  });
  socket.on(PEER_NEG_NEEDED, ({ to, offer }) => {
    io.to(to).emit(PEER_NEG_NEEDED, { from: socket.id, offer });
  });
  socket.on(PEER_NEG_DONE, ({ to, offer }) => {
    io.to(to).emit(PEER_NEG_DONE, { from: socket.id, offer });
  });
});

_httpServer.listen(8000, () => {
  console.log(`SigServer Running on PORT:${process.env.PORT || 8000}`);
});
