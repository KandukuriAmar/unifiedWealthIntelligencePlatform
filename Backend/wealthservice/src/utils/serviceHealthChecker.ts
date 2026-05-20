import axios from "axios";

export const checkServiceHealth =
async (
  url: string
) => {

  try {
    const healthUrl = url.endsWith("3001") ? `${url}/health` : url;
    await axios.get(healthUrl);

    return "UP";

  } catch (error: any) {
    if (error.response) {
      return "UP";
    }
    return "DOWN";
  }
};