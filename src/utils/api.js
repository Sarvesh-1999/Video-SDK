const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// get token from backend
export const getToken = async () => {
  const res = await fetch(`${BACKEND_URL}/token`);
  const data = await res.json();
  return data.token;
};

// create room via backend
export const createRoom = async (token) => {
  const res = await fetch(`${BACKEND_URL}/room`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token,
    },
  });

  const data = await res.json();
  return data.roomId;
};

// validate room via backend
export const validateMeeting = async (token, meetingId) => {
  const res = await fetch(
    `${BACKEND_URL}/room/validate/${meetingId}`,
    {
      headers: {
        "Authorization": token,
      },
    }
  );

  return res.ok;
};
