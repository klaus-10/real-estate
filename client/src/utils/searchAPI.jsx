import axios from "axios";



/**
 * Retrieves real estate data from the specified API endpoint.
 *
 * @return {Promise<void>} A promise that resolves when the data is successfully retrieved, or rejects with an error if there was a problem.
 */
export const getRealEstateDataAPI = async (page) => {
  try {
    const response = await axios.get("http://localhost:8080/real-estate/list", { params: { page: page } });
    return response.data;
  } catch (error) {
    console.error("Error fetching real estate data:", error);
    // throw error; // Rethrow the error to be handled elsewhere if needed
  }
};
