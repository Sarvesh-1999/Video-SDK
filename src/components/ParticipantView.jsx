import React, { useEffect, useRef, useMemo } from 'react';
import { useParticipant } from '@videosdk.live/react-sdk';

const ParticipantView = ({ participantId }) => {
  const micRef = useRef(null);
  const videoRef = useRef(null);

  const {
    displayName,
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    mode
  } = useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  const audioStream = useMemo(() => {
    if (micOn && micStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(micStream.track);
      return mediaStream;
    }
  }, [micStream, micOn]);

  useEffect(() => {
    if (micRef.current && audioStream) {
      micRef.current.srcObject = audioStream;
      micRef.current.play().catch(err => 
        console.error('Error playing audio:', err)
      );
    }
  }, [audioStream]);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play().catch(err => 
        console.error('Error playing video:', err)
      );
    }
  }, [videoStream]);

  return (
    <div style={{
      position: 'relative',
      width: '300px',
      height: '200px',
      backgroundColor: '#1a1a2e',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '2px solid #4a5568',
      margin: '10px'
    }}>
      <audio ref={micRef} autoPlay muted={isLocal} />
      {webcamOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          color: '#fff',
          backgroundColor: '#2d3748'
        }}>
          {displayName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      )}
      
      <div style={{
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        right: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '4px 8px',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {displayName || 'Guest'} {isLocal && '(You)'}
          {mode === 'VIEWER' && ' 👁️'}
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: micOn ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)',
            fontSize: '12px'
          }}>
            {micOn ? '🎤' : '🎤'}
          </span>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: webcamOn ? 'rgba(34,197,94,0.8)' : 'rgba(239,68,68,0.8)',
            fontSize: '12px'
          }}>
            {webcamOn ? '📹' : '📹'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ParticipantView;