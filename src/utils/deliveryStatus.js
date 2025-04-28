const StatusColor = {
  ordered: "#2A72AC",
  shipped: "#B8A816",
  outForDelivery: "#1CB880",
  delivered: "#3B9E3B",
};

export const StatusTextColor = (deliveryStatus) => {
  let textColor;
  switch (deliveryStatus) {
    case "Ordered":
      textColor = StatusColor.ordered;
      break;
    case "Shipped":
      textColor = StatusColor.shipped;
      break;
    case "outForDelivery":
      textColor = StatusColor.outForDelivery;
      break;
    case "Delivered":
      textColor = StatusColor.delivered;
      break;
    default:
      textColor = "#000";
  }
  return textColor;
};

export const hexToRgba = (hex, opacity) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const isDarkTheme = (hex) => {
  // Normalize HEX to #RRGGBB format
  let normalizedHex = hex.replace("#", "");
  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  // Convert HEX to RGB
  const r = parseInt(normalizedHex.substring(0, 2), 16);
  const g = parseInt(normalizedHex.substring(2, 4), 16);
  const b = parseInt(normalizedHex.substring(4, 6), 16);

  // Formula: 0.2126*R + 0.7152*G + 0.0722*B
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Threshold for dark vs light (128 is a common threshold for 8-bit colors)
  return luminance < 128 ? true : false;
};
