import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { roomsApi, videoApi, ApiError } from '../api/client';
import {
  emitVideoJoin,
  emitVideoLeave,
  emitVideoSignal,
  getSocket,
  type VideoPeerJoinedPayload,
  type VideoPeerLeftPayload,
  type VideoSignalPayload,
} from '../api/socket';
import { useAuth } from '../auth/AuthContext';
import type { RoomSummary } from '../types';

interface RemotePeer {
  socketId: string;
  userId: string;
  displayName: string;
  stream: MediaStream;
}

type FilterKey = 'filter-none' | 'filter-glow' | 'filter-retro' | 'filter-smooth';
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'filter-none', label: 'Natural' },
  { key: 'filter-glow', label: '✨ Glow' },
  { key: 'filter-retro', label: '📼 Retro' },
  { key: 'filter-smooth', label: '🌫️ Smooth' },
];

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    // Free TURN fallback so calls connect behind symmetric NATs.
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
};

function StreamVideo({ stream, label, filter, mirrored }: { stream: MediaStream | null; label: string; filter: string; mirrored?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div className="video-tile">
      <video ref={ref} autoPlay playsInline muted={mirrored} className={filter} style={mirrored ? { transform: 'scaleX(-1)' } : undefined} />
      <span className="tile-label">{label}</span>
    </div>
  );
}

export default function VideoPage() {
  const { user } = useAuth();
  const location = useLocation() as { state?: { roomId?: string; roomName?: string } };

  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [roomId, setRoomId] = useState<string>(location.state?.roomId ?? '');
  const [inCall, setInCall] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<RemotePeer[]>([]);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [filter, setFilter] = useState<FilterKey>('filter-none');
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  // Refs hold the live call state so socket handlers (attached once) never go stale.
  const pcs = useRef(new Map<string, RTCPeerConnection>());
  const localStreamRef = useRef<MediaStream | null>(null);
  const inCallRef = useRef(false);
  const roomIdRef = useRef('');
  const peerNames = useRef(new Map<string, string>());
  const sessionIdRef = useRef<string | null>(null);

  const removePeer = useCallback((socketId: string) => {
    const pc = pcs.current.get(socketId);
    if (pc) {
      pc.close();
      pcs.current.delete(socketId);
    }
    peerNames.current.delete(socketId);
    setPeers((prev) => prev.filter((p) => p.socketId !== socketId));
  }, []);

  const createPeerConnection = useCallback(
    async (socketId: string, displayName: string, initiator: boolean) => {
      if (pcs.current.has(socketId)) return pcs.current.get(socketId)!;
      const pc = new RTCPeerConnection(ICE_SERVERS);
      pcs.current.set(socketId, pc);
      peerNames.current.set(socketId, displayName);

      const stream = localStreamRef.current;
      if (stream) stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      pc.onicecandidate = (ev) => {
        if (ev.candidate) emitVideoSignal(socketId, { candidate: ev.candidate });
      };
      pc.ontrack = (ev) => {
        const remote = ev.streams[0];
        setPeers((prev) => {
          if (prev.some((p) => p.socketId === socketId)) {
            return prev.map((p) => (p.socketId === socketId ? { ...p, stream: remote } : p));
          }
          return [...prev, { socketId, userId: socketId, displayName, stream: remote }];
        });
      };
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') removePeer(socketId);
      };

      if (initiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        emitVideoSignal(socketId, { sdp: offer });
      }
      return pc;
    },
    [removePeer],
  );

  const handleSignal = useCallback(
    async (from: string, raw: unknown) => {
      if (!inCallRef.current) return;
      const sig = raw as { sdp?: RTCSessionDescriptionInit; candidate?: RTCIceCandidateInit };
      let pc = pcs.current.get(from);
      if (!pc) {
        // Signal arrived before the peer-joined notice — create a passive PC.
        pc = await createPeerConnection(from, peerNames.current.get(from) ?? 'Guest', false);
      }
      try {
        if (sig.sdp) {
          await pc.setRemoteDescription(new RTCSessionDescription(sig.sdp));
          if (sig.sdp.type === 'offer') {
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            emitVideoSignal(from, { sdp: answer });
          }
        } else if (sig.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(sig.candidate));
        }
      } catch {
        // Transient SDP/ICE races are normal; the connection recovers or drops.
      }
    },
    [createPeerConnection],
  );

  // Attach signaling listeners once per mount.
  useEffect(() => {
    const s = getSocket();
    const onJoined = (p: VideoPeerJoinedPayload) => {
      if (!inCallRef.current) return;
      createPeerConnection(p.socketId, p.userId, true).catch(() => undefined);
    };
    const onLeft = (p: VideoPeerLeftPayload) => removePeer(p.socketId);
    const onSignal = (p: VideoSignalPayload) => handleSignal(p.from, p.signal);
    s.on('video:peer-joined', onJoined);
    s.on('video:peer-left', onLeft);
    s.on('video:signal', onSignal);
    return () => {
      s.off('video:peer-joined', onJoined);
      s.off('video:peer-left', onLeft);
      s.off('video:signal', onSignal);
    };
  }, [createPeerConnection, handleSignal, removePeer]);

  useEffect(() => {
    roomsApi.list().then(({ rooms }) => setRooms(rooms)).catch(() => undefined);
  }, []);

  // Peer display names: the contract gives userId on peer-joined; resolve later if needed.
  useEffect(() => {
    roomIdRef.current = roomId;
  }, [roomId]);

  const endCall = useCallback(async () => {
    if (roomIdRef.current && inCallRef.current) emitVideoLeave(roomIdRef.current);
    const sid = sessionIdRef.current;
    if (sid) videoApi.end(sid).catch(() => undefined);
    pcs.current.forEach((pc) => pc.close());
    pcs.current.clear();
    peerNames.current.clear();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    inCallRef.current = false;
    sessionIdRef.current = null;
    setPeers([]);
    setLocalStream(null);
    setInCall(false);
    setSessionId(null);
    setMuted(false);
    setCameraOff(false);
  }, []);

  // Always clean up media + signaling when leaving the page.
  useEffect(() => () => {
    if (roomIdRef.current && inCallRef.current) emitVideoLeave(roomIdRef.current);
    pcs.current.forEach((pc) => pc.close());
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const startCall = async () => {
    if (!roomId || inCall || starting) return;
    setStarting(true);
    setError(null);
    try {
      // 1. Ask the backend for a video session in this room.
      const { sessionId: sid } = await videoApi.start(roomId);
      // 2. Grab camera + mic.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      localStreamRef.current = stream;
      inCallRef.current = true;
      roomIdRef.current = roomId;
      sessionIdRef.current = sid;
      setLocalStream(stream);
      setSessionId(sid);
      setInCall(true);
      // 3. Join the signaling channel — existing peers announce themselves,
      //    and we offer to each newcomer via video:peer-joined.
      emitVideoJoin(roomId);
    } catch (e) {
      inCallRef.current = false;
      if (e instanceof DOMException && (e.name === 'NotAllowedError' || e.name === 'NotFoundError')) {
        setError('Camera or microphone unavailable. Please allow access and make sure a camera is connected, then try again.');
      } else {
        setError(e instanceof ApiError ? e.message : 'Could not start the video call.');
      }
    } finally {
      setStarting(false);
    }
  };

  const toggleMute = () => {
    const next = !muted;
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !next; });
    setMuted(next);
  };

  const toggleCamera = () => {
    const next = !cameraOff;
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !next; });
    setCameraOff(next);
  };

  const selectedRoom = rooms.find((r) => r.id === roomId);

  return (
    <div>
      <div className="page-head">
        <h1 className="page-title">Video</h1>
        <p className="page-sub">Face-to-face in any room. Mesh video — everyone connects directly to everyone.</p>
      </div>

      {!inCall && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div className="field">
            <label htmlFor="video-room">Pick a room</label>
            <select id="video-room" className="select" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              <option value="">Choose a room…</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          {rooms.length === 0 && (
            <p className="form-note">You aren't in any rooms yet. Create one from the Chats tab first.</p>
          )}
          {error && <div className="form-error">{error}</div>}
          <button className="btn btn-block" onClick={startCall} disabled={!roomId || starting}>
            {starting ? 'Starting camera…' : '📹 Start video'}
          </button>
          <p className="form-note" style={{ marginTop: '0.8rem' }}>
            Your browser will ask for camera and microphone permission.
          </p>
        </div>
      )}

      {inCall && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.6rem' }}>
            <h3 style={{ margin: 0 }}>
              📹 {selectedRoom?.name ?? location.state?.roomName ?? 'Video call'}
              <span className="badge badge-blue" style={{ marginLeft: '0.6rem' }}>{peers.length + 1} on camera</span>
            </h3>
            <div className="field" style={{ margin: 0, minWidth: 180 }}>
              <label htmlFor="cam-filter">Camera filter</label>
              <select id="cam-filter" className="select" value={filter} onChange={(e) => setFilter(e.target.value as FilterKey)}>
                {FILTERS.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="video-grid">
            <StreamVideo stream={localStream} label={`${user?.displayName ?? 'You'} (you)`} filter={filter} mirrored />
            {peers.map((p) => (
              <div key={p.socketId} style={{ position: 'relative' }}>
                <StreamVideo stream={p.stream} label={p.displayName} filter={filter} />
              </div>
            ))}
          </div>

          {peers.length === 0 && (
            <p className="form-note" style={{ textAlign: 'center', marginTop: '1rem' }}>
              You're on camera — waiting for others to join the room…
            </p>
          )}

          <div className="video-controls">
            <button className={`ctrl-btn${muted ? ' off' : ''}`} onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
              {muted ? '🔇' : '🎤'}
            </button>
            <button className={`ctrl-btn${cameraOff ? ' off' : ''}`} onClick={toggleCamera} title={cameraOff ? 'Turn camera on' : 'Turn camera off'}>
              {cameraOff ? '🚫' : '📷'}
            </button>
            <button className="ctrl-btn leave" onClick={endCall}>Leave</button>
          </div>
          {error && <div className="form-error" style={{ marginTop: '0.8rem' }}>{error}</div>}
        </div>
      )}
    </div>
  );
}
