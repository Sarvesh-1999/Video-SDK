import React, { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import JoinScreen from "./components/JoinScreen";
import MeetingView from "./components/MeetingView";
import MediaRelayManager from "./components/MediaRelayManager";

function App() {
  const [token, setToken] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [roomAId, setRoomAId] = useState(null);
  const [roomBId, setRoomBId] = useState(null);
  const [userName, setUserName] = useState("Guest");
  const [mediaRelayActive, setMediaRelayActive] = useState(false);
  const [showSetup, setShowSetup] = useState(true);

  // Handle initial join
  const handleJoin = ({ roomAId, roomBId, userName }) => {
    const authToken = import.meta.env.VITE_VIDEOSDK_TOKEN || "";

    if (!authToken) {
      alert("Please set VITE_VIDEOSDK_TOKEN in your .env file");
      return;
    }

    setToken(authToken);
    setRoomAId(roomAId);
    setRoomBId(roomBId);
    setCurrentRoomId(roomAId);
    setUserName(userName);
    setShowSetup(false);
  };

  // Handle leaving meeting
  const handleLeave = () => {
    setCurrentRoomId(null);
    setShowSetup(true);
    setMediaRelayActive(false);
  };

  // Handle room switch
  const handleRoomSwitch = (newRoomId) => {
    setCurrentRoomId(newRoomId);
    setMediaRelayActive(false);
  };

  // Toggle media relay
  const handleMediaRelayToggle = () => {
    setMediaRelayActive(!mediaRelayActive);
  };

  // Determine target room for switching
  const getTargetRoomId = () => {
    if (currentRoomId === roomAId) return roomBId;
    if (currentRoomId === roomBId) return roomAId;
    return null;
  };

  const getRoomName = (roomId) => {
    if (roomId === roomAId) return "Room A";
    if (roomId === roomBId) return "Room B";
    return "Unknown Room";
  };

  if (showSetup) {
    return <JoinScreen onJoin={handleJoin} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "20px 30px",
          backgroundColor: "royalblue",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                color: "#fff",
                fontSize: "24px",
                margin: 0,
                fontWeight: "700",
              }}
            >
              VideoSDK Room Switch Demo
            </h1>
            <p
              style={{
                color: "#cbd5e0",
                fontSize: "14px",
                margin: "5px 0 0 0",
              }}
            >
              User: {userName}
            </p>
          </div>

          <button
            onClick={handleLeave}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "red",
              color: "#fff",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
           Exit Demo
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
          }}
        >
          {currentRoomId && token && (
            <MeetingProvider
              config={{
                meetingId: currentRoomId,
                micEnabled: true,
                webcamEnabled: true,
                name: userName,
                mode: "CONFERENCE",
                debugMode: true,
              }}
              token={token}
            >
              <MeetingView
                meetingId={currentRoomId}
                onLeave={handleLeave}
                roomName={getRoomName(currentRoomId)}
                onSwitchRoom={handleRoomSwitch}
                targetRoomId={getTargetRoomId()}
                onMediaRelayToggle={handleMediaRelayToggle}
                isMediaRelayActive={mediaRelayActive}
              />

              {mediaRelayActive && (
                <MediaRelayManager
                  sourceRoomId={currentRoomId}
                  targetRoomId={getTargetRoomId()}
                  isActive={mediaRelayActive}
                  onStatusChange={(status) => {
                    console.log("Media relay status:", status);
                  }}
                />
              )}
            </MeetingProvider>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
