export const fullmontharray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
export const montharray = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

export const AllMonths = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export const DateField = (dateInput, format) => {
  const d = new Date(dateInput);
  const date = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  let formattedDate = "";
  if (format === "YYYY-MM-DD") {
    formattedDate = `${year}-${month}-${date}`;
  } else if (format === "DD/MM/YYYY") {
    formattedDate = `${date}/${month}/${year}`;
  } else if (format === "Month DD, YYYY") {
    formattedDate = `${fullmontharray[d.getMonth()]} ${date}, ${year}`;
  } else if (format === "DD Mon YYYY") {
    formattedDate = `${date} ${montharray[d.getMonth()]} ${year}`;
  } else if (format === "DD/MM/YY") {
    formattedDate = `${date}/${month}/${year.toString().slice(2, 4)}`;
  } else if (format === "DD.MM.YYYY") {
    formattedDate = `${date}.${month}.${year}`;
  } else if (format === "dd Mon, YYYY") {
    formattedDate = `${date} ${montharray[d.getMonth()]}, ${year}`;
  }
  return formattedDate;
};

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;

  return `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;
};
