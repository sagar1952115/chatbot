export function formatTimestamp(timestamp) {
  console.log(timestamp);
  const date = new Date(timestamp);

  const day = date.getDate(); // Get the day of the month
  const month = date.toLocaleString("default", { month: "short" }); // Get the month in short form (e.g., 'Feb')
  const hours = String(date.getHours()).padStart(2, "0"); // Get the hour and pad with leading 0 if needed
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get the minutes and pad with leading 0 if needed

  return `${day} ${month}, ${hours}:${minutes}`; // Format the string as "11 Feb, 13:20"
}
