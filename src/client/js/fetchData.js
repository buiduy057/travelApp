const fetchData = async (url = "", data = { location: "", date: "" }) => {
  try {
    const response = await axios.post(url, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

module.exports = {
  fetchData,
};
