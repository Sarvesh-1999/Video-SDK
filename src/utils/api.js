// VideoSDK API utilities
const VIDEOSDK_API_ENDPOINT = 'https://api.videosdk.live/v2';

export const getToken = async () => {
  // For production, implement proper backend authentication
  // This is a placeholder - you need to replace with your actual API key
  const API_KEY = import.meta.env.VITE_VIDEOSDK_API_KEY;
  
  if (!API_KEY) {
    console.warn('API Key not found. Using demo mode.');
    // Return a demo token structure for testing UI
    return 'DEMO_TOKEN_REPLACE_WITH_ACTUAL';
  }

  try {
    const response = await fetch(`${VIDEOSDK_API_ENDPOINT}/rooms`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
};

export const createRoom = async (token) => {
  try {
    const response = await fetch(`${VIDEOSDK_API_ENDPOINT}/rooms`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data.roomId;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

export const validateMeeting = async (token, meetingId) => {
  try {
    const response = await fetch(`${VIDEOSDK_API_ENDPOINT}/rooms/validate/${meetingId}`, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error validating meeting:', error);
    return false;
  }
};