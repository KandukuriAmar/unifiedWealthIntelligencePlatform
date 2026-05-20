import axios from "axios";

export const checkServiceHealth =
async (
  url: string
) => {

  try {

    await axios.get(url);

    return "UP";

  } catch (error) {

    return "DOWN";
  }
};