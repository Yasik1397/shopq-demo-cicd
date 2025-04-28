import { DefaultImage } from "../constants/IMAGES";

export const checkImageAccessibility = async (imageUrl) => {
  if (!imageUrl) {
    return DefaultImage.products;
  }

  try {
    const response = await fetch(imageUrl, { method: "HEAD" });
    return response.ok ? imageUrl : DefaultImage.products;
  } catch (error) {
    return DefaultImage.products;
  }
};
