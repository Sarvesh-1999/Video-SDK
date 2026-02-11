import React, { useEffect, useState, useRef } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import ParticipantView from "./ParticipantView";

const MeetingView = ({
  meetingId,
  onLeave,
  roomName,
  onSwitchRoom,
  targetRoomId,
  onMediaRelayToggle,
  isMediaRelayActive,
}) => {
  const [joined, setJoined] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const {
    join,
    leave,
    toggleMic,
    toggleWebcam,
    participants,
    localParticipant,
    startHls,
    stopHls,
    hlsState,
    switchTo,
  } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
      setIsSwitching(false);
    },
    onMeetingLeft: () => {
      setJoined(null);
      onLeave && onLeave();
    },
    onError: (error) => {
      console.error("Meeting error:", error);
      setIsSwitching(false);
    },
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  // Handle normal room switch
  const handleNormalSwitch = async () => {
    if (!targetRoomId) {
      alert("Please provide target room ID");
      return;
    }

    setIsSwitching(true);
    try {
      await switchTo({
        meetingId: targetRoomId,
        token: null,
        micEnabled: true,
        webcamEnabled: true,
      });

      onSwitchRoom && onSwitchRoom(targetRoomId);
    } catch (error) {
      console.error("Error switching room:", error);
      setIsSwitching(false);
      alert("Failed to switch room: " + error.message);
    }
  };

  // Handle media relay toggle
  const handleMediaRelayToggle = () => {
    if (onMediaRelayToggle) {
      onMediaRelayToggle();
    }
  };

  useEffect(() => {
    return () => {
      if (joined === "JOINED") {
        leave();
      }
    };
  }, []);

  const participantIds = [...participants.keys()];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: "12px",
        margin: "10px",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "15px",
          backgroundColor: "darkblue",
          borderRadius: "8px",
        }}
      >
        <div>
          <h2 style={{ color: "#fff", margin: 0 }}>{roomName}</h2>
          <p
            style={{ color: "#cbd5e0", fontSize: "14px", margin: "5px 0 0 0" }}
          >
            Meeting ID: {meetingId}
          </p>
          {joined === "JOINED" && (
            <p
              style={{
                color: "#48bb78",
                fontSize: "12px",
                margin: "5px 0 0 0",
              }}
            >
              ✓ Connected | {participantIds.length} participant
              {participantIds.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {joined === "JOINED" && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={toggleMic}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4299e1",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Toggle Mic
            </button>

            <button
              onClick={toggleWebcam}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4299e1",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Toggle Webcam
            </button>

            {targetRoomId && (
              <button
                onClick={handleNormalSwitch}
                disabled={isSwitching}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isSwitching ? "#718096" : "#ed8936",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {isSwitching ? "⏳ Switching..." : "Switch Room"}
              </button>
            )}

            {targetRoomId && (
              <button
                onClick={handleMediaRelayToggle}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: isMediaRelayActive ? "#48bb78" : "#9f7aea",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {isMediaRelayActive ? "Media Relay ON" : "Enable Media Relay"}
              </button>
            )}

            <button
              onClick={leave}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#f56565",
                color: "#fff",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Leave
            </button>
          </div>
        )}
      </div>

      {joined === "JOINED" ? (
        <div>
          <h3 style={{ color: "#fff", marginBottom: "15px" }}>Participants</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
            }}
          >
            {participantIds.map((participantId) => (
              <ParticipantView
                key={participantId}
                participantId={participantId}
              />
            ))}
          </div>

          {isMediaRelayActive && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "rgba(72,187,120,0.2)",
                border: "2px solid #48bb78",
                borderRadius: "8px",
                color: "#fff",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>📡 Media Relay Active</h4>
              <p style={{ margin: 0, fontSize: "14px", color: "#e2e8f0" }}>
                Your audio and video are being relayed to the other room.
                Participants in the target room can see and hear you.
              </p>
            </div>
          )}
        </div>
      ) : joined === "JOINING" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            color: "black",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid rgba(255,255,255,0.3)",
              borderTop: "5px solid #fff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ marginTop: "20px", fontSize: "18px" }}>
            Joining meeting...
          </p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <button
            onClick={joinMeeting}
            style={{
              padding: "15px 40px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "green",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "600",
              boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
            }}
          >
            Join {roomName}
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingView;
