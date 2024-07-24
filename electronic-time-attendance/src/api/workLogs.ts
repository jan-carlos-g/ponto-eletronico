import api from "./api";

export const getWorkLogs = async (userId: number, token: string) => {
  try {
    const response = await api.get(`/worklogs/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching work logs:", error);
    throw error;
  }
};

export const getActiveWorkLogSession = async (
  userId: number,
  token: string,
) => {
  try {
    const response = await api.get(`/worklogs/active/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Active work log session fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching active work log session:", error);
    throw error;
  }
};

export const startWorkLogSession = async (userId: number, token: string) => {
  try {
    const response = await api.post(
      `/worklogs/start`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error starting work log session:", error);
    throw error;
  }
};

export const endWorkLogSession = async (
  userId: number,
  token: string,
  currentTime: number,
) => {
  try {
    const response = await api.post(
      `/worklogs/end`,
      { userId, currentTime },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Clock out registered successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error registering clock out:", error);
    throw error;
  }
};
