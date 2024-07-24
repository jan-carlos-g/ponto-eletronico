import api from "./api";

export const loginUser = async (
  cod: string,
  updateAuthContext?: (userId: number, token: string, name: string) => void,
): Promise<void> => {
  try {
    const response = await api.post("/login", { cod });
    const { token, userId, name } = response.data.token;
    if (userId === undefined || userId === null) {
      throw new Error("userId do usuário não retornado pela API");
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("name", name);

    if (updateAuthContext) {
      updateAuthContext(userId, token, name);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
