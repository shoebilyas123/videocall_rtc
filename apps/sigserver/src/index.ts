import { createServer } from 'http';
import { Server } from 'socket.io';
import { SOCKET_CONST } from 'app_constants';

// TODO: CONFIGURE dotenv.config({});

const _httpServer = createServer();

const io = new Server(_httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const { CALL_ACCEPTED, CALL_USER, INCOMING_CALL } = SOCKET_CONST;

io.on('connection', (socket) => {
  console.log(`SOCKET CONNECTED: ${socket.id}`);

  // User calls remote (with Offer)
  socket.on(CALL_USER, ({ to, offer }) => {
    io.to(to).emit(INCOMING_CALL, { offer, from: socket.id });
  });
  socket.on(CALL_ACCEPTED, ({ to, answer }) => {
    io.to(to).emit(CALL_ACCEPTED, { from: socket.id, answer });
  });

  // Remote sends an answer
  //   User adds that answer to the LocalDescription and the p2p conneciton is established
});

_httpServer.listen(8000);
