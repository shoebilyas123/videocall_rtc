import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { FaPhone } from 'react-icons/fa';

import { useSocket } from '../../context/socket';
import { SOCKET_CONST } from 'app_constants';
import peer from '../../services/peer';
import Button from '../atoms/button';

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
    console.log('USER JOINED', remoteAlias, remoteId);
    generateOffer(remoteId);
  }, []);

  const generateOffer = async (_rId: string) => {
    const offer = await peer.makeOffer();
    console.log({ offer });

    socket.emit(CALL_USER, { to: _rId, offer });
  };

  async function initRoom() {
    const _str = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(_str);
  }
  useEffect(() => {
    initRoom();
  }, []);

  const handleIncomingCall = async ({ offer, from }: any) => {
    const answer = await peer.makeAnswer(offer);
    console.log({ answer });
    socket.emit(CALL_ACCEPTED, { to: from, answer });
  };

  const handleCallAccepted = async ({ from, answer }: any) => {
    console.log(myStream, from, answer);
    await peer.setLocalDescription(answer);
    console.log(myStream);
  };

  useEffect(() => {
    socket.on(NEW_USER_JOINED, handleNewUserJoined);
    socket.on(INCOMING_CALL, handleIncomingCall);
    socket.on(CALL_ACCEPTED, handleCallAccepted);

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
      <div className="w-full flex items-center">
        {myStream ? (
          <ReactPlayer
            autoPlay
            playing
            width={'400'}
            height={'245'}
            url={myStream}
          />
        ) : null}

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
    </div>
  );
};

export default Room;
