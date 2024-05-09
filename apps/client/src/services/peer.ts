class PeerService {
  peer: RTCPeerConnection | null = null;

  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:global.stun.twilio.com:3478',
            ],
          },
        ],
      });
    }
  }

  async makeOffer() {
    if (this.peer) {
      const offer = await this.peer?.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));

      return offer;
    }
  }
  //   TODO: Type fixing
  async makeAnswer(offer: any) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));

      return answer;
    }
  }
}

export default new PeerService();
