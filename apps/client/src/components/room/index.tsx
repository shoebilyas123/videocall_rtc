import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';

import { useSocket } from '../../context/socket';
import { SOCKET_CONST } from 'app_constants';
import peer from '../../services/peer';

const Room = () => {
  const { socket } = useSocket();
  const { roomNumber, userAlias } = useParams();

  const [remoteConnData, setRemoteConnData] = useState<{
    socketId: string | null;
    userAlias: string | null;
  }>({ socketId: null, userAlias: null });
  const [myStream, setMyStream] = useState<any>(null);

  const { NEW_USER_JOINED, CALL_USER, CALL_ACCEPTED, INCOMING_CALL } =
    SOCKET_CONST;

  const handleNewUserJoined = useCallback(({ remoteId, remoteAlias }: any) => {
    setRemoteConnData({ socketId: remoteId, userAlias: remoteAlias });
  }, []);

  const initRoomStream = async () => {
    const _str = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(_str);
    const offer = await peer.makeOffer();

    socket.emit(CALL_USER, { to: remoteConnData.socketId, offer });
  };

  const handleIncomingCall = () => {};

  useEffect(() => {
    initRoomStream();
  }, [remoteConnData, roomNumber, userAlias]);

  useEffect(() => {
    socket.on(NEW_USER_JOINED, handleNewUserJoined);
    socket.on(INCOMING_CALL, handleIncomingCall);

    return () => {
      socket.off(NEW_USER_JOINED, handleNewUserJoined);
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1>Room</h1>
      <h2>
        {remoteConnData.socketId
          ? `Connected To ${remoteConnData.userAlias}`
          : `Room Empty`}
      </h2>
      {myStream ? (
        <ReactPlayer
          autoPlay
          playing
          width={'400'}
          height={'245'}
          url={myStream}
        />
      ) : null}
    </div>
  );
};

export default Room;
