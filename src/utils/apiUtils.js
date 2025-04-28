export const fetchPincode = async (pincode) => {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching data:", error);
    return null;
  }
};
