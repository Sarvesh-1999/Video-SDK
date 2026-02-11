# VideoSDK Room Switch & Media Relay Demo

A React application demonstrating seamless room switching and media relay functionality using VideoSDK. This project showcases two different approaches to transitioning participants between video conference rooms.

## 🎯 Features

- **Dual Room Support**: Manage two separate VideoSDK rooms (Room A and Room B)
- **Seamless Room Switching**: Switch participants between rooms without full reconnection
- **Media Relay**: Broadcast audio/video from one room to another while maintaining presence
- **Real-time Media Controls**: Toggle microphone and webcam during sessions
- **Responsive UI**: Clean, modern interface with real-time status updates

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- VideoSDK account ([Sign up here](https://app.videosdk.live/))
- VideoSDK authentication token

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd videosdk-room-switch
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your VideoSDK token:
```env
VITE_VIDEOSDK_TOKEN=your_videosdk_token_here
```

**How to get your VideoSDK token:**
1. Go to [VideoSDK Dashboard](https://app.videosdk.live/)
2. Sign up or log in
3. Navigate to API Keys section
4. Generate a new token or copy existing one

### 4. Create Room IDs

You need two room IDs for this demo. You can create them using:

**Option A: VideoSDK Dashboard**
- Go to your VideoSDK dashboard
- Navigate to Rooms section
- Create two new rooms
- Copy both room IDs

**Option B: API Call**
```bash
# Create Room A
curl -X POST https://api.videosdk.live/v2/rooms \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json"

  curl -X POST https://api.videosdk.live/v2/rooms -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIyYjVmYWIyZS05Yjg5LTQwNGMtOTQ2Yi1iZDFlYTNjZGQ5NmQiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIiwiYWxsb3dfbW9kIl0sImlhdCI6MTc3MDcyMDQ4MywiZXhwIjoxNzcwODA2ODgzfQ.1izyBc8JKiCmTHn6KGv0fWfasNLR4rJvCfgPVTeBSsU" -H "Content-Type: application/json"
  curl -X POST https://api.videosdk.live/v2/rooms -H "Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example" -H "Content-Type: application/json"

# Create Room B
curl -X POST https://api.videosdk.live/v2/rooms \
  -H "Authorization: YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 5. Run the Application
```bash
npm run dev
```

The application will start at `http://localhost:3000`

## 🎬 How to Use

### Initial Setup

1. Open the application in your browser
2. Enter your name
3. Enter Room A ID (first room you'll join)
4. Enter Room B ID (target room for switching)
5. Click "Join Room A"

### Testing Normal Room Switch

1. Join Room A by clicking the join button
2. Enable your microphone and webcam if desired
3. Once connected, click the **"🔄 Switch Room"** button
4. You'll be seamlessly transitioned to Room B
5. Your media streams (audio/video) will be maintained during the switch

### Testing Media Relay

1. While in either room, click the **"📡 Enable Media Relay"** button
2. Your audio and video will now be broadcast to the other room
3. Participants in the target room can see and hear you
4. You remain in your current room while relaying media
5. Click the button again to disable media relay

## 🏗️ Project Structure
```
videosdk-room-switch/
├── src/
│   ├── components/
│   │   ├── JoinScreen.jsx          # Initial setup screen
│   │   ├── MeetingView.jsx         # Main meeting interface
│   │   ├── ParticipantView.jsx     # Individual participant rendering
│   │   └── MediaRelayManager.jsx   # Media relay logic
│   ├── utils/
│   │   └── api.js                  # VideoSDK API utilities
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   └── index.css                   # Global styles
├── .env.example                     # Environment variables template
├── package.json                     # Dependencies and scripts
├── vite.config.js                  # Vite configuration
└── README.md                       # This file
```

## 🔄 Room Switching Implementation

### Normal Room Switch

VideoSDK provides a `switchTo()` method for seamless room transitions:
```javascript
const { switchTo } = useMeeting();

// Switch to a different room
await switchTo({
  meetingId: targetRoomId,
  token: existingToken,
  micEnabled: true,
  webcamEnabled: true
});
```

**How it works:**
1. Maintains existing media streams
2. Gracefully disconnects from current room
3. Establishes connection to target room
4. Re-publishes media streams
5. Minimal interruption for the user

### Media Relay

Media relay broadcasts your streams to another room while staying connected:
```javascript
const { startHls, hlsUrls } = useMeeting();

// Start HLS for broadcasting
await startHls({
  layout: { type: 'SPOTLIGHT' },
  theme: 'DARK',
  mode: 'video-and-audio'
});
```

## 📊 Comparison: Normal Switch vs Media Relay

| Feature | Normal Switch | Media Relay |
|---------|---------------|-------------|
| **Connection** | Single room at a time | Maintain source room + broadcast |
| **Bandwidth** | Lower | Higher |
| **Use Case** | Moving between meetings | Presenting to multiple rooms |
| **Latency** | Low | Medium (HLS delay) |

## 🐛 Troubleshooting

### Common Issues

1. **"API Key not found"**
   - Check `.env` file exists and contains `VITE_VIDEOSDK_TOKEN`
   - Restart dev server after adding token

2. **"Failed to join meeting"**
   - Verify token is valid
   - Check room IDs are correct
   - Ensure stable internet connection

3. **Camera/Microphone not working**
   - Grant browser permissions
   - Close other apps using camera/mic
   - Try different browser

## 📚 Additional Resources

- [VideoSDK Documentation](https://docs.videosdk.live/)
- [VideoSDK React SDK](https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/getting-started)
- [API Reference](https://docs.videosdk.live/api-reference/realtime-communication/intro)

## 📝 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using VideoSDK**