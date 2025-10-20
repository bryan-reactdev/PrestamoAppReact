export function getCurrentDate(){
  return new Date().toLocaleDateString('sv-ES').split('-').join('-');
}

export function DateTimeToDateAndTime(fecha) {
  const date = new Date(fecha);

  // Get components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours; // convert 0 to 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

export function DateTimeToDate(fecha) {
  const date = new Date(fecha);

  // Get components
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = String(date.getFullYear()).slice(-2); // last 2 digits

  return `${day}/${month}/${year}`;
}