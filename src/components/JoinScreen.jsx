import React, { useState } from "react";

const JoinScreen = ({ onJoin }) => {
  const [roomAId, setRoomAId] = useState("");
  const [roomBId, setRoomBId] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const getRoomID = async () => {
    let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/room`, {
      method: "POST",
      headers: {
        Authorization: import.meta.env.VITE_VIDEOSDK_TOKEN,
      },
    });
    console.log(res);
    let data = await res.json();
    console.log(data.roomId);
    if (!roomAId) {
      setRoomAId(data.roomId);
    } else if (!roomBId) {
      setRoomBId(data.roomId);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!roomAId.trim()) {
      setError("Please enter Room A ID");
      return;
    }

    if (!roomBId.trim()) {
      setError("Please enter Room B ID");
      return;
    }

    if (!userName.trim()) {
      setError("Please enter your name");
      return;
    }

    onJoin({
      roomAId: roomAId.trim(),
      roomBId: roomBId.trim(),
      userName: userName.trim(),
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "16px",
          padding: "40px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            VideoSDK Room Switch
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d3748",
                fontSize: "14px",
              }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d3748",
                fontSize: "14px",
              }}
            >
              Room A ID{" "}
              <span
                onClick={getRoomID}
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                get ID
              </span>
            </label>
            <input
              type="text"
              value={roomAId}
              onChange={(e) => setRoomAId(e.target.value)}
              placeholder="e.g., abc-def-ghi"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#718096",
                marginTop: "5px",
                marginBottom: 0,
              }}
            >
              First room you'll join
            </p>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
                fontWeight: "600",
                color: "#2d3748",
                fontSize: "14px",
              }}
            >
              Room B ID{" "}
              <span
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                 onClick={getRoomID}
              >
                get ID
              </span>
            </label>
            <input
              type="text"
              value={roomBId}
              onChange={(e) => setRoomBId(e.target.value)}
              placeholder="e.g., jkl-mno-pqr"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
            />
            <p
              style={{
                fontSize: "12px",
                color: "#718096",
                marginTop: "5px",
                marginBottom: 0,
              }}
            >
              Target room for switching
            </p>
          </div>

          {error && (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#fed7d7",
                color: "#c53030",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              background: "royalblue",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            }}
          >
            Join Room A
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinScreen;
