export const capitalizeFirstLetter = (string) => {
  return `${string}`?.charAt(0)?.toUpperCase() + `${string}`?.slice(1);
};

export const truncateText = (text, length) => {
  return text?.length > length ? `${text.substring(0, length)}...` : text;
};

export const maskNumber = (num) => {
  if (!num || num.length < 10) {
    return "Invalid number";
  }
  const first = num.slice(0, 3);
  const last = num.slice(-2);
  return `${first}XXXXX${last}`;
};
