const axios = require("axios");

const makePostRequest = async (url: string, data: any) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(url, data, config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(`Error in making POST request: ${error.message}`);
  }
};

module.exports = { makePostRequest };
