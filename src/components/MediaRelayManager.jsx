import React, { useEffect, useState } from 'react';
import { useMeeting, usePubSub } from '@videosdk.live/react-sdk';

/**
 * MediaRelayManager handles the relay of audio/video streams between two rooms
 * This component demonstrates VideoSDK's capability to broadcast media from one room to another
 */
const MediaRelayManager = ({ 
  sourceRoomId, 
  targetRoomId, 
  isActive,
  onStatusChange 
}) => {
  const [relayStatus, setRelayStatus] = useState('idle');
  const [error, setError] = useState(null);
  
  const { 
    localParticipant,
    startVideo,
    stopVideo,
    startHls,
    stopHls,
    hlsState,
    hlsUrls
  } = useMeeting();

  useEffect(() => {
    if (!isActive) {
      handleStopRelay();
      return;
    }

    handleStartRelay();

    return () => {
      handleStopRelay();
    };
  }, [isActive, targetRoomId]);

  const handleStartRelay = async () => {
    try {
      setRelayStatus('starting');
      setError(null);
      
      // In VideoSDK, media relay can be achieved through:
      // 1. HLS streaming (broadcast to multiple rooms)
      // 2. Custom plugin for peer-to-peer relay
      // 3. Multistream feature (if available in your plan)
      
      console.log(`Starting media relay from ${sourceRoomId} to ${targetRoomId}`);
      
      // Start HLS for broadcasting
      if (hlsState === 'HLS_STOPPED') {
        await startHls({
          layout: {
            type: 'SPOTLIGHT',
            priority: 'PIN',
            gridSize: 4
          },
          theme: 'DARK',
          mode: 'video-and-audio'
        });
      }
      
      setRelayStatus('active');
      onStatusChange && onStatusChange('active');
      
    } catch (err) {
      console.error('Error starting media relay:', err);
      setError(err.message);
      setRelayStatus('error');
      onStatusChange && onStatusChange('error');
    }
  };

  const handleStopRelay = async () => {
    try {
      setRelayStatus('stopping');
      
      console.log('Stopping media relay');
      
      // Stop HLS if it was started
      if (hlsState === 'HLS_STARTED' || hlsState === 'HLS_STARTING') {
        await stopHls();
      }
      
      setRelayStatus('idle');
      onStatusChange && onStatusChange('idle');
      
    } catch (err) {
      console.error('Error stopping media relay:', err);
      setError(err.message);
    }
  };

  // PubSub for signaling between rooms
  const { publish, messages } = usePubSub('MEDIA_RELAY_SIGNAL', {
    onMessageReceived: (message) => {
      console.log('Relay signal received:', message);
      // Handle relay coordination signals
    }
  });

  // Send relay metadata to target room
  const sendRelaySignal = () => {
    if (isActive && targetRoomId) {
      publish({
        action: 'RELAY_ACTIVE',
        sourceRoom: sourceRoomId,
        targetRoom: targetRoomId,
        hlsUrls: hlsUrls,
        timestamp: Date.now()
      }, { persist: true });
    }
  };

  useEffect(() => {
    if (relayStatus === 'active' && hlsUrls) {
      sendRelaySignal();
    }
  }, [relayStatus, hlsUrls]);

  return null; // This is a logic-only component
};

export default MediaRelayManager;