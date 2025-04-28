import EncryptedStorage from "react-native-encrypted-storage";

// Utility function for storing a value in EncryptedStorage
export const StoreValue = async (key, data) => {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(data));
    return { status: "success", message: "Data stored successfully." };
  } catch (error) {
    return { status: "fail", message: error.message || "Storage error." };
  }
};

// Utility function for retrieving a value from EncryptedStorage
export const GetValue = async (key) => {
  try {
    const storedData = await EncryptedStorage.getItem(key);

    if (storedData) {
      return { status: "success", data: JSON.parse(storedData) };
    }

    return { status: "fail", message: "Item not found." };
  } catch (error) {
    return { status: "fail", message: error.message || "Retrieval error." };
  }
};

// Utility function for deleting a value from EncryptedStorage
export const DeleteValue = async (key) => {
  try {
    await EncryptedStorage.removeItem(key);
    return { status: "success", message: "Item deleted successfully." };
  } catch (error) {
    return { status: "fail", message: error.message || "Deletion error." };
  }
};
